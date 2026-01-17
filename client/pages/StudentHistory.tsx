import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { dbService, LeaveRequest } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";

export default function StudentHistory() {
  const { user } = useAuth();
  const [historyRecords, setHistoryRecords] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    if (user?.id) {
      dbService.getStudentRequests(user.id).then(setHistoryRecords);
    }
  }, [user]);

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "casual":
        return "bg-primary-100 text-primary";
      case "medical":
        return "bg-accent-100 text-accent";
      case "emergency":
        return "bg-destructive-100 text-destructive";
      case "holiday":
        return "bg-success-100 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const approvedCount = historyRecords.filter(r => r.status === "approved").length;
  const rejectedCount = historyRecords.filter(r => r.status === "rejected").length;
  const totalDaysUsed = historyRecords.reduce((sum, record) => {
    if (record.status === "approved") {
      const start = new Date(record.startDate);
      const end = new Date(record.endDate);
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;
      return sum + days;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Leave History</h1>
        <p className="text-muted-foreground">
          View all your past leave requests and their status
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Approved</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-success">
                {approvedCount}
              </span>
              <span className="text-muted-foreground">requests</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Total Rejected</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-destructive">
                {rejectedCount}
              </span>
              <span className="text-muted-foreground">requests</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-2">Days Used</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {totalDaysUsed}
              </span>
              <span className="text-muted-foreground">days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Records */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Request History</h2>
        <div className="space-y-3">
          {historyRecords.map((record) => (
            <Card key={record.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Top row with type and status */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getTypeColor(record.type)}`}
                    >
                      {record.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}
                    >
                      {getStatusIcon(record.status)}
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>

                  {/* Dates and reason */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {record.startDate} to {record.endDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.reason}
                    </p>
                  </div>

                  {/* Timeline info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Applied On</p>
                      <p className="text-sm font-medium text-foreground">
                        {record.appliedOn}
                      </p>
                    </div>
                    {record.respondedOn && (
                      <>
                        <div>
                          <p className="text-xs text-muted-foreground">Responded By</p>
                          <p className="text-sm font-medium text-foreground">
                            {record.respondedBy}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Exit Status</p>
                          <p className={`text-sm font-bold ${record.isScanned ? "text-success" : "text-warning"}`}>
                            {record.isScanned ? "✓ Exited" : "Still Inside"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {record.remarks && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">Remarks</p>
                      <p className="text-sm text-foreground italic">
                        "{record.remarks}"
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
