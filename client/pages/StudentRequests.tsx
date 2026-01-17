import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface LeaveRequest {
  id: string;
  type: "casual" | "medical" | "emergency" | "holiday";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
}

export default function StudentRequests() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [allRequests, setAllRequests] = useState<LeaveRequest[]>([
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
    {
      id: "3",
      type: "casual",
      startDate: "2024-03-01",
      endDate: "2024-03-03",
      reason: "Family visit",
      status: "rejected",
      appliedOn: "2024-02-25",
    },
  ]);

  const [formData, setFormData] = useState({
    type: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      alert("Please fill in all fields");
      return;
    }

    const newRequest: LeaveRequest = {
      id: (allRequests.length + 1).toString(),
      type: formData.type as "casual" | "medical" | "emergency" | "holiday",
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: "pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };

    setAllRequests([newRequest, ...allRequests]);
    setFormData({ type: "casual", startDate: "", endDate: "", reason: "" });
    setShowForm(false);
    alert("Request submitted successfully!");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Leave Requests</h1>
          <p className="text-muted-foreground">
            View and manage all your leave applications
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary-600 text-white"
          >
            New Request
          </Button>
        )}
      </div>

      {/* New Request Form */}
      {showForm && (
        <Card className="shadow-card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Submit New Leave Request</CardTitle>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Leave Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="medical">Medical Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason for Leave *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Provide a brief reason for your leave"
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-600 text-white"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          All Requests ({allRequests.length})
        </h2>
        <div className="space-y-3">
          {allRequests.map((request) => (
            <Card key={request.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                    <p className="text-sm text-muted-foreground mb-2">
                      {request.startDate} to {request.endDate}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Reason:</strong> {request.reason}
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
