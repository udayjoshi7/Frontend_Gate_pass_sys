import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaveRequest {
  id: string;
  type: "casual" | "medical" | "emergency" | "holiday";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [leaveStats] = useState({
    casual: { used: 4, total: 12 },
    medical: { used: 2, total: 5 },
    emergency: { used: 0, total: 3 },
  });

  const [recentRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      type: "casual",
      startDate: "2024-02-15",
      endDate: "2024-02-17",
      reason: "Personal work",
      status: "approved",
      appliedOn: "2024-02-10",
    },
    {
      id: "2",
      type: "medical",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      reason: "Doctor appointment",
      status: "pending",
      appliedOn: "2024-02-18",
    },
  ]);

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
          Welcome, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Reg: {user?.registrationNumber}
        </p>
      </div>

      {/* Leave Balance Cards */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Leave Balance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(leaveStats).map(([type, stats]) => (
            <Card key={type} className="shadow-card">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground capitalize mb-2">
                  {type} Leave
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {stats.total - stats.used}
                  </span>
                  <span className="text-muted-foreground">
                    of {stats.total} days
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${((stats.total - stats.used) / stats.total) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/student/requests/new">
            <Button className="w-full h-12 bg-primary hover:bg-primary-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Apply for Leave
            </Button>
          </Link>
          <Link to="/student/requests/holiday">
            <Button
              variant="outline"
              className="w-full h-12"
            >
              <FileText className="w-4 h-4 mr-2" />
              Holiday Advance Application
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Recent Requests</h2>
          <Link to="/student/requests" className="text-primary hover:underline text-sm">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {recentRequests.map((request) => (
            <Card key={request.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground capitalize">
                        {request.type} Leave
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {request.startDate} to {request.endDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Reason: {request.reason}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    Applied on<br />
                    {request.appliedOn}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
