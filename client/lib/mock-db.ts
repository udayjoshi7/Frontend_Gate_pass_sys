import { User } from "@/context/AuthContext";

export interface LeaveRequest {
    id: string;
    studentId: string;
    studentName: string;
    registrationNumber: string;
    type: "casual" | "medical" | "emergency" | "holiday";
    startDate: string;
    endDate: string;
    reason: string;
    status: "pending" | "approved" | "rejected";
    appliedOn: string;
    qrCodeToken?: string;
    qrCodeExpiresAt?: string;
    isScanned?: boolean;
}

const REQUESTS_KEY = "leave_hub_requests";

// Initialize with some dummy data if empty
const initializeDB = () => {
    if (!localStorage.getItem(REQUESTS_KEY)) {
        const dummyRequests: LeaveRequest[] = [
            {
                id: "1",
                studentId: "123",
                studentName: "John Doe",
                registrationNumber: "REG2024001",
                type: "casual",
                startDate: "2024-02-15",
                endDate: "2024-02-17",
                reason: "Personal work",
                status: "approved",
                appliedOn: "2024-02-10",
                qrCodeToken: "LEAVE-1-TOKEN", // Pre-approved for demo
                qrCodeExpiresAt: new Date(Date.now() + 86400000).toISOString(), // 24h from now
                isScanned: false,
            },
            {
                id: "2",
                studentId: "123",
                studentName: "John Doe",
                registrationNumber: "REG2024001",
                type: "medical",
                startDate: "2024-02-20",
                endDate: "2024-02-20",
                reason: "Doctor appointment",
                status: "pending",
                appliedOn: "2024-02-18",
            },
        ];
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(dummyRequests));
    }
};

export const db = {
    getRequests: (): LeaveRequest[] => {
        initializeDB();
        return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]");
    },

    getStudentRequests: (studentId: string): LeaveRequest[] => {
        const requests = db.getRequests();
        // For demo purposes, if studentId matches "123" or we return all since we might not have persistent IDs
        // But let's try to filter if possible, or just return all for the simple demo if IDs are random
        return requests;
    },

    getAllRequests: (): LeaveRequest[] => {
        return db.getRequests();
    },

    addRequest: (request: Omit<LeaveRequest, "id" | "status" | "appliedOn">) => {
        const requests = db.getRequests();
        const newRequest: LeaveRequest = {
            ...request,
            id: Date.now().toString(),
            status: "pending",
            appliedOn: new Date().toISOString().split("T")[0],
        };
        requests.push(newRequest);
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
        return newRequest;
    },

    updateRequestStatus: (id: string, status: "approved" | "rejected") => {
        const requests = db.getRequests();
        const updatedRequests = requests.map((req) => {
            if (req.id === id) {
                const updates: Partial<LeaveRequest> = { status };
                if (status === "approved") {
                    // Generate QR Token and Expiry (e.g., valid until end date + buffer or 24h)
                    // For simplicity, let's say valid for 24 hours from approval
                    const expiry = new Date();
                    expiry.setHours(expiry.getHours() + 24);

                    updates.qrCodeToken = `LEAVE-${id}-${Math.random().toString(36).substring(7)}`;
                    updates.qrCodeExpiresAt = expiry.toISOString();
                    updates.isScanned = false;
                }
                return { ...req, ...updates };
            }
            return req;
        });
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests));
    },

    scanQRCode: (token: string): { success: boolean; message: string; request?: LeaveRequest } => {
        const requests = db.getRequests();
        const requestIndex = requests.findIndex((req) => req.qrCodeToken === token);

        if (requestIndex === -1) {
            return { success: false, message: "Invalid QR Code" };
        }

        const request = requests[requestIndex];

        if (request.isScanned) {
            return { success: false, message: "QR Code already used/scanned" };
        }

        if (request.qrCodeExpiresAt && new Date(request.qrCodeExpiresAt) < new Date()) {
            return { success: false, message: "QR Code expired" };
        }

        // Mark as scanned
        requests[requestIndex].isScanned = true;
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));

        return { success: true, message: "Verified Successfully", request: requests[requestIndex] };
    },
};
