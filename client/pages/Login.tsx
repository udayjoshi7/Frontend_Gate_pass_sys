import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, BookOpen, Users } from "lucide-react";

type UserRole = "student" | "faculty" | "admin";

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
    icon: <User className="w-8 h-8" />,
    color: "accent",
  },
  {
    role: "admin",
    label: "Admin",
    description: "Manage system and users",
    icon: <Users className="w-8 h-8" />,
    color: "destructive",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("credentials");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedRole === "student" && !formData.registrationNumber) {
      alert("Please enter your registration number");
      return;
    }

    // Create user object
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: selectedRole,
      registrationNumber: formData.registrationNumber,
      department: "Engineering",
    };

    login(newUser);
    
    // Navigate to appropriate dashboard
    switch (selectedRole) {
      case "student":
        navigate("/student/dashboard");
        break;
      case "faculty":
        navigate("/faculty/dashboard");
        break;
      case "admin":
        navigate("/admin/dashboard");
        break;
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
                <CardTitle>{selectedRole && roles.find(r => r.role === selectedRole)?.label} Login</CardTitle>
                <button
                  onClick={() => {
                    setStep("role");
                    setSelectedRole(null);
                    setFormData({ name: "", email: "", registrationNumber: "" });
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Back
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {selectedRole === "student" && (
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

                <Button
                  type="submit"
                  className="w-full mt-6 h-10 bg-primary hover:bg-primary-600 text-white"
                >
                  Login
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Demo credentials - Use any name and email to proceed
                </p>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
