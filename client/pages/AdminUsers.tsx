import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Trash2, Edit2, Plus, UserPlus, Shield, User as UserIcon } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin" | "security_guard";
  registrationNumber?: string;
  department?: string;
  status: "active" | "inactive";
  joinedDate: string;
}

const DEPARTMENTS = ["Computer Science", "Engineering", "Electrical", "Mechanical", "Civil", "General"];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "student" | "faculty" | "admin" | "security_guard">("all");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty" as const,
    department: DEPARTMENTS[0],
    registrationNumber: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        joinedDate: doc.data().joinedDate || "N/A",
        status: doc.data().status || "active",
      } as User));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // To create a user without logging out the current admin, we use a secondary firebase app instance
      const secondaryConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };

      const secondaryApp = initializeApp(secondaryConfig, "Secondary");
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, newUser.password);
      const firebaseUser = userCredential.user;

      const userProfile = {
        id: firebaseUser.uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        registrationNumber: newUser.registrationNumber,
        status: "active",
        joinedDate: new Date().toISOString().split("T")[0],
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userProfile);

      // Cleanup secondary app
      await deleteApp(secondaryApp);

      alert(`User Created: ${newUser.name} registered as ${newUser.role}`);
      setIsDialogOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "faculty", department: DEPARTMENTS[0], registrationNumber: "" });
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert(error.message || "Failed to add user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user? This will only remove their profile from Firestore. Their Auth account must be deleted via Firebase Console.")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter(u => u.id !== id));
        alert("User profile deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await setDoc(doc(db, "users", user.id), { ...user, status: newStatus }, { merge: true });
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student": return "bg-primary/10 text-primary";
      case "faculty": return "bg-accent/10 text-accent";
      case "admin": return "bg-destructive/10 text-destructive";
      case "security_guard": return "bg-slate-100 text-slate-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const roleStats = {
    student: users.filter(u => u.role === "student").length,
    faculty: users.filter(u => u.role === "faculty").length,
    admin: users.filter(u => u.role === "admin").length,
    security: users.filter(u => u.role === "security_guard").length,
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage all system users and their roles
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Staff/Security</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Dr. Alice Smith"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="alice@college.edu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Temporary Password</label>
                <Input
                  required
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value as any })}
                  >
                    <option value="faculty">Faculty</option>
                    <option value="security_guard">Security Guard</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={newUser.department}
                    onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Users</p>
            <p className="text-3xl font-bold text-primary">{users.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Students</p>
            <p className="text-3xl font-bold text-primary">{roleStats.student}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Faculty</p>
            <p className="text-3xl font-bold text-accent">{roleStats.faculty}</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Security</p>
            <p className="text-3xl font-bold text-slate-600">{roleStats.security}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "student", "faculty", "security_guard", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterRole === role
                ? "bg-primary text-white"
                : "bg-border text-foreground hover:bg-border/80"
                }`}
            >
              {role.replace("_", " ").charAt(0).toUpperCase() + role.replace("_", " ").slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Users ({filteredUsers.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-primary-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' ? <Shield className="w-4 h-4" /> :
                          user.role === 'faculty' ? <UserPlus className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.registrationNumber || user.department || "No Dept"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleColor(user.role)}`}
                    >
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${user.status === "active"
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.joinedDate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 hover:bg-border rounded transition-colors text-muted-foreground hover:text-foreground"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 hover:bg-destructive/10 rounded transition-colors text-muted-foreground hover:text-destructive"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-lg mt-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No users found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
