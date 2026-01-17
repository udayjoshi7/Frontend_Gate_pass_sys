import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { dbService, LeaveRequest } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";

export default function FacultyRequests() {
  const { user } = useAuth();
  const [allRequests, setAllRequests] = useState<LeaveRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    refreshRequests();
  }, [user]);

  const refreshRequests = async () => {
    if (user?.department) {
      setAllRequests(await dbService.getFacultyRequests(user.department));
    } else {
      // For admin or if no department, maybe show all (but here we strictly filter for faculty branch)
      setAllRequests(await dbService.getAllRequests());
    }
  };

  const filteredRequests = allRequests.filter(
    (req) => filterStatus === "all" || req.status === filterStatus
  );

  const handleApprove = async (id: string) => {
    await dbService.updateRequestStatus(id, "approved", user?.name);
    await refreshRequests();
    setSelectedRequest(null);
    setRemarks("");
    alert("Request approved!");
  };

  const handleReject = async (id: string) => {
    await dbService.updateRequestStatus(id, "rejected", user?.name);
    await refreshRequests();
    setSelectedRequest(null);
    setRemarks("");
    alert("Request rejected!");
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
          Leave Applications
        </h1>
        <p className="text-muted-foreground">
          Review and approve/reject student leave requests
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === status
              ? "bg-primary text-white"
              : "bg-border text-foreground hover:bg-border/80"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === "pending" && ` (${allRequests.filter(r => r.status === "pending").length})`}
          </button>
        ))}
      </div>

      {/* Detail View */}
      {selectedRequest && (
        <Card className="shadow-card-hover border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Review Request</CardTitle>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setRemarks("");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Info */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Student Information</h3>
              <div className="grid grid-cols-2 gap-4 p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedRequest.studentName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Registration</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedRequest.registrationNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Leave Details */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Leave Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Leave Type</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {selectedRequest.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedRequest.startDate} to {selectedRequest.endDate}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reason</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedRequest.reason}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Applied On</p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedRequest.appliedOn}
                  </p>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any remarks or comments..."
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground"
              />
            </div>

            {/* Actions */}
            {selectedRequest.status === "pending" && (
              <div className="flex gap-3 justify-end pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedRequest.id)}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  Reject
                </Button>
                <Button
                  className="bg-success hover:bg-green-600 text-white"
                  onClick={() => handleApprove(selectedRequest.id)}
                >
                  Approve
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {filterStatus === "all" ? "All Requests" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} (
          {filteredRequests.length})
        </h2>
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {request.studentName}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {request.registrationNumber}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1 capitalize">
                      {request.type} Leave • {request.startDate} to {request.endDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.reason}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    Applied<br />
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
