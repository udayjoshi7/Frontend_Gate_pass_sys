import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, BookOpen, Users, Lock, Mail } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type UserRole = "student" | "faculty" | "admin" | "security_guard";

interface RoleOption {
  role: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const roles: RoleOption[] = [
  {
    role: "student",
    label: "Student",
    description: "Apply for leave and view status",
    icon: <BookOpen className="w-8 h-8" />,
    color: "primary",
  },
  {
    role: "faculty",
    label: "Faculty",
    description: "Approve or reject applications",
    icon: <UserIcon className="w-8 h-8" />,
    color: "accent",
  },
  {
    role: "admin",
    label: "Admin",
    description: "Manage system and users",
    icon: <Users className="w-8 h-8" />,
    color: "destructive",
  },
  {
    role: "security_guard",
    label: "Security",
    description: "Convert QR codes & verify leaves",
    icon: <Users className="w-8 h-8" />,
    color: "slate-600",
  },
];

const DEPARTMENTS = ["Computer Science", "Engineering", "Electrical", "Mechanical", "Civil"];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registrationNumber: "",
    department: DEPARTMENTS[0],
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("credentials");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (!formData.email || !formData.password) {
      alert("Please fill in all required fields");
      return;
    }

    if (isRegistering && !formData.name) {
      alert("Please enter your name");
      return;
    }

    if (selectedRole === "student" && !formData.registrationNumber) {
      alert("Please enter your registration number");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const firebaseUser = userCredential.user;

        // Create user profile in Firestore
        const userProfile = {
          id: firebaseUser.uid,
          name: formData.name,
          email: formData.email,
          role: selectedRole,
          registrationNumber: selectedRole === "student" ? formData.registrationNumber : "",
          department: formData.department,
        };

        await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
        // Auth state listener in AuthProvider will handle navigation if we want, 
        // but let's navigate manually for immediate feedback
      } else {
        // Sign in with Firebase Auth
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }

      // Navigation is handled by the useEffect in AuthProvider or we can do it here after a small delay
      // Since we updated AuthProvider to use onAuthStateChanged, it will automatically update 'user' state.

      // Let's force navigation based on role
      switch (selectedRole) {
        case "student": navigate("/student/dashboard"); break;
        case "faculty": navigate("/faculty/dashboard"); break;
        case "admin": navigate("/admin/dashboard"); break;
        case "security_guard": navigate("/security/dashboard"); break;
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      alert(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary rounded-lg p-3 mb-4">
            <div className="text-white font-bold text-2xl">✓</div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">LeaveHub</h1>
          <p className="text-muted-foreground">College Leave Management System</p>
        </div>

        {step === "role" ? (
          // Role Selection
          <div className="grid gap-4">
            <p className="text-center text-foreground font-medium mb-2">
              Select your role to get started
            </p>
            {roles.map((roleOption) => (
              <button
                key={roleOption.role}
                onClick={() => handleRoleSelect(roleOption.role)}
                className="group p-6 rounded-xl border-2 border-border hover:border-primary transition-all hover:shadow-card-hover bg-white"
              >
                <div className={`text-${roleOption.color} mb-3 group-hover:scale-110 transition-transform`}>
                  {roleOption.icon}
                </div>
                <h3 className="font-semibold text-foreground text-left mb-1">
                  {roleOption.label}
                </h3>
                <p className="text-sm text-muted-foreground text-left">
                  {roleOption.description}
                </p>
              </button>
            ))}
          </div>
        ) : (
          // Credentials Form
          <Card className="shadow-card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {isRegistering ? "Create Account" : "Login"} as {selectedRole && roles.find(r => r.role === selectedRole)?.label}
                </CardTitle>
                <button
                  onClick={() => {
                    setStep("role");
                    setSelectedRole(null);
                    setIsRegistering(false);
                    setFormData({ name: "", email: "", password: "", registrationNumber: "", department: DEPARTMENTS[0] });
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Back
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {selectedRole === "student" && isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Registration Number *
                    </label>
                    <Input
                      type="text"
                      name="registrationNumber"
                      placeholder="e.g., REG2024001"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Department / Branch *
                    </label>
                    <select
                      name="department"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 h-10 bg-primary hover:bg-primary-600 text-white"
                >
                  {isLoading ? "Processing..." : isRegistering ? "Create Account" : "Login"}
                </Button>

                {/* Only students can sign up themselves. Faculty/Security are added by Admin. */}
                {selectedRole === "student" && (
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-sm text-primary hover:underline"
                    >
                      {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                    </button>
                  </div>
                )}

                {selectedRole !== "student" && !isRegistering && (
                  <p className="text-center text-xs text-muted-foreground mt-4 italic">
                    Contact administration to create a faculty or security account.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
