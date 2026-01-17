import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, BarChart3 } from "lucide-react";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    if (user) {
      switch (user.role) {
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
    }
  }, [user, navigate]);

  // If user is logged in, show loading
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              ✓
            </div>
            LeaveHub
          </div>
          <Button
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary-600 text-white"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Simplify Your Leave Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            LeaveHub is a modern, intuitive platform for managing college leave
            requests. Submit, track, and approve leave applications with ease.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="h-12 px-8 bg-primary hover:bg-primary-600 text-white text-lg"
          >
            Start Now
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-card-hover">
            <CardContent className="pt-6">
              <div className="text-primary mb-4 flex justify-center">
                <BookOpen className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                For Students
              </h3>
              <p className="text-muted-foreground">
                Submit leave requests, apply for holiday advances, and track
                your application history all in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card-hover">
            <CardContent className="pt-6">
              <div className="text-accent mb-4 flex justify-center">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                For Faculty
              </h3>
              <p className="text-muted-foreground">
                Review student applications, approve or reject requests, and
                manage student profiles with detailed leave information.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card-hover">
            <CardContent className="pt-6">
              <div className="text-destructive mb-4 flex justify-center">
                <BarChart3 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                For Admins
              </h3>
              <p className="text-muted-foreground">
                Monitor system-wide activity, manage users, configure settings,
                and generate comprehensive reports.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 LeaveHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
