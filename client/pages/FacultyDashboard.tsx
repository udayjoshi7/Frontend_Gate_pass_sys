import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { dbService, LeaveRequest } from "@/lib/db";

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [allRequests, setAllRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      if (user?.department) {
        const requests = await dbService.getFacultyRequests(user.department);
        setAllRequests(requests);
      }
      setIsLoading(false);
    };
    fetchRequests();
  }, [user]);

  const pendingRequests = allRequests.filter(r => r.status === "pending");

  const stats = {
    pending: pendingRequests.length,
    approved: allRequests.filter(r => r.status === "approved").length,
    rejected: allRequests.filter(r => r.status === "rejected").length,
    students: new Set(allRequests.map(r => r.studentId)).size || 0,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success/10 text-success";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      case "pending":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome, Prof. {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Department: {user?.department}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold text-warning">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Approved
                </p>
                <p className="text-3xl font-bold text-success">
                  {stats.approved}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-destructive">
                  {stats.rejected}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-destructive opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Students
                </p>
                <p className="text-3xl font-bold text-primary">
                  {stats.students}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/faculty/requests">
            <Button className="w-full h-12 bg-primary hover:bg-primary-600 text-white">
              <Clock className="w-4 h-4 mr-2" />
              Review Pending Requests
            </Button>
          </Link>
          <Link to="/faculty/students">
            <Button
              variant="outline"
              className="w-full h-12"
            >
              <Users className="w-4 h-4 mr-2" />
              View Student Profiles
            </Button>
          </Link>
        </div>
      </div>

      {/* Pending Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Pending Requests</h2>
          <Link to="/faculty/requests" className="text-primary hover:underline text-sm">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {pendingRequests.slice(0, 3).map((request) => (
            <Card key={request.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {request.studentName}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {request.studentId}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1 capitalize">
                      {request.type} Leave • {request.startDate} to {request.endDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.reason}
                    </p>
                  </div>
                  <Link to={`/faculty/requests?id=${request.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Review
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
