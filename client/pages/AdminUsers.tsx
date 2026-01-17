import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Edit2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  registrationNumber?: string;
  department?: string;
  status: "active" | "inactive";
  joinedDate: string;
}

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "student" | "faculty" | "admin">("all");
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Raj Patel",
      email: "raj.patel@college.edu",
      role: "student",
      registrationNumber: "REG2024001",
      department: "Computer Science",
      status: "active",
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Dr. John Smith",
      email: "john.smith@college.edu",
      role: "faculty",
      department: "Computer Science",
      status: "active",
      joinedDate: "2023-06-10",
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@college.edu",
      role: "admin",
      status: "active",
      joinedDate: "2023-01-01",
    },
    {
      id: "4",
      name: "Sarah Johnson",
      email: "sarah.johnson@college.edu",
      role: "student",
      registrationNumber: "REG2024015",
      department: "Computer Science",
      status: "active",
      joinedDate: "2024-01-15",
    },
    {
      id: "5",
      name: "Dr. Sarah Mendez",
      email: "sarah.mendez@college.edu",
      role: "faculty",
      department: "Electrical Engineering",
      status: "active",
      joinedDate: "2023-07-15",
    },
    {
      id: "6",
      name: "Mike Chen",
      email: "mike.chen@college.edu",
      role: "student",
      registrationNumber: "REG2024008",
      department: "Computer Science",
      status: "inactive",
      joinedDate: "2024-01-15",
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleStats = {
    student: users.filter(u => u.role === "student").length,
    faculty: users.filter(u => u.role === "faculty").length,
    admin: users.filter(u => u.role === "admin").length,
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
      alert("User deleted successfully");
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u =>
      u.id === id
        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
        : u
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-primary-100 text-primary";
      case "faculty":
        return "bg-accent-100 text-accent";
      case "admin":
        return "bg-destructive-100 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
        <Button className="bg-primary hover:bg-primary-600 text-white">
          + Add User
        </Button>
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
            <p className="text-sm text-muted-foreground mb-2">Admins</p>
            <p className="text-3xl font-bold text-destructive">{roleStats.admin}</p>
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
          {["all", "student", "faculty", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterRole === role
                  ? "bg-primary text-white"
                  : "bg-border text-foreground hover:bg-border/80"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
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
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      {user.registrationNumber && (
                        <p className="text-xs text-muted-foreground">
                          {user.registrationNumber}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${
                        user.status === "active"
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
        </div>
      </div>
    </div>
  );
}
