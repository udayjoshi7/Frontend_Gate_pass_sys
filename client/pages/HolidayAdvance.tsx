import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock } from "lucide-react";

interface HolidayAdvance {
  id: string;
  holiday: string;
  requestedDays: number;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
}

export default function HolidayAdvance() {
  const [showForm, setShowForm] = useState(false);
  const [advanceRequests, setAdvanceRequests] = useState<HolidayAdvance[]>([
    {
      id: "1",
      holiday: "Christmas Holiday",
      requestedDays: 7,
      startDate: "2024-12-20",
      endDate: "2024-12-27",
      status: "pending",
      appliedOn: "2024-11-15",
    },
    {
      id: "2",
      holiday: "Summer Vacation",
      requestedDays: 30,
      startDate: "2024-05-15",
      endDate: "2024-06-14",
      status: "approved",
      appliedOn: "2024-04-10",
    },
  ]);

  const [formData, setFormData] = useState({
    holiday: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const calculateDays = (start: string, end: string) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
      return Math.max(0, days);
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.holiday || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    const days = calculateDays(formData.startDate, formData.endDate);
    
    const newRequest: HolidayAdvance = {
      id: (advanceRequests.length + 1).toString(),
      holiday: formData.holiday,
      requestedDays: days,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };

    setAdvanceRequests([newRequest, ...advanceRequests]);
    setFormData({ holiday: "", startDate: "", endDate: "", reason: "" });
    setShowForm(false);
    alert("Holiday advance request submitted!");
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
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Holiday Advance Applications
          </h1>
          <p className="text-muted-foreground">
            Apply for advance holidays or view your applications
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary-600 text-white"
          >
            New Application
          </Button>
        )}
      </div>

      {/* Info Box */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground">
            <strong>About Holiday Advances:</strong> Apply to use your holiday days
            in advance for upcoming festivals and celebrations. Your faculty advisor
            must approve your request.
          </p>
        </CardContent>
      </Card>

      {/* Form */}
      {showForm && (
        <Card className="shadow-card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Submit Holiday Advance Request</CardTitle>
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
                  Holiday Name *
                </label>
                <Input
                  type="text"
                  value={formData.holiday}
                  onChange={(e) =>
                    setFormData({ ...formData, holiday: e.target.value })
                  }
                  placeholder="e.g., Diwali, Christmas, Summer Vacation"
                  required
                />
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
                  Total Days Requested: <strong>{calculateDays(formData.startDate, formData.endDate)}</strong>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason/Purpose *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Explain why you need these holiday days in advance"
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

      {/* Applications List */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Your Applications ({advanceRequests.length})
        </h2>
        <div className="space-y-3">
          {advanceRequests.map((request) => (
            <Card key={request.id} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {request.holiday}
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
                      <strong>{request.requestedDays}</strong> days requested
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
