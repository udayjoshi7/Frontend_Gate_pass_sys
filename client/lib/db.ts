import { db } from "./firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    getDoc,
    orderBy
} from "firebase/firestore";

export interface LeaveRequest {
    id: string; // Firestore ID
    studentId: string;
    studentName: string;
    registrationNumber: string;
    department: string;
    type: "casual" | "medical" | "emergency" | "holiday";
    startDate: string;
    endDate: string;
    reason: string;
    status: "pending" | "approved" | "rejected";
    appliedOn: string;
    qrCodeToken?: string;
    qrCodeExpiresAt?: string;
    isScanned?: boolean;
    respondedOn?: string;
    respondedBy?: string;
    remarks?: string;
}

const COLLECTION_NAME = "leave_requests";

export const dbService = {
    getAllRequests: async (): Promise<LeaveRequest[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as LeaveRequest));
        } catch (error) {
            console.error("Error getting documents: ", error);
            return [];
        }
    },

    getStudentRequests: async (studentId: string): Promise<LeaveRequest[]> => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("studentId", "==", studentId),
                orderBy("appliedOn", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as LeaveRequest));
        } catch (error) {
            console.error("Error getting student requests:", error);
            // Fallback for missing indexes
            try {
                const q = query(collection(db, COLLECTION_NAME), where("studentId", "==", studentId));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as LeaveRequest)).sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));
            } catch (innerError) {
                console.error("Fallback error:", innerError);
                return [];
            }
        }
    },

    getFacultyRequests: async (department: string): Promise<LeaveRequest[]> => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("department", "==", department),
                orderBy("appliedOn", "desc")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as LeaveRequest));
        } catch (error) {
            console.error("Error getting faculty requests:", error);
            // Fallback for missing indexes
            try {
                const q = query(collection(db, COLLECTION_NAME), where("department", "==", department));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as LeaveRequest)).sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));
            } catch (innerError) {
                console.error("Fallback error:", innerError);
                return [];
            }
        }
    },

    addRequest: async (request: Omit<LeaveRequest, "id" | "status" | "appliedOn">): Promise<LeaveRequest> => {
        const newRequestData = {
            ...request,
            status: "pending" as const,
            appliedOn: new Date().toISOString().split("T")[0],
        };

        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), newRequestData);
            return { id: docRef.id, ...newRequestData } as LeaveRequest;
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    },

    updateRequestStatus: async (id: string, status: "approved" | "rejected", respondedBy?: string) => {
        const qrCodeToken = status === "approved" ? `PASS-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now()}` : null;
        const qrCodeExpiresAt = status === "approved" ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null;

        const updates: any = {
            status,
            respondedOn: new Date().toISOString(),
            respondedBy: respondedBy || "Unknown Faculty"
        };

        if (status === "approved") {
            updates.qrCodeToken = qrCodeToken;
            updates.qrCodeExpiresAt = qrCodeExpiresAt;
            updates.isScanned = false;
        }

        try {
            const requestRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(requestRef, updates);
        } catch (e) {
            console.error("Error updating document: ", e);
            throw e;
        }
    },

    scanQRCode: async (token: string): Promise<{ success: boolean; message: string; request?: LeaveRequest }> => {
        try {
            const q = query(collection(db, COLLECTION_NAME), where("qrCodeToken", "==", token));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return { success: false, message: "Invalid QR Code" };
            }

            const docSnapshot = querySnapshot.docs[0];
            const request = { id: docSnapshot.id, ...docSnapshot.data() } as LeaveRequest;

            if (request.isScanned) {
                return { success: false, message: "QR Code already used/scanned" };
            }

            if (request.qrCodeExpiresAt && new Date(request.qrCodeExpiresAt) < new Date()) {
                return { success: false, message: "QR Code expired" };
            }

            // Mark as scanned
            await updateDoc(doc(db, COLLECTION_NAME, request.id), { isScanned: true });

            // Return updated request
            return { success: true, message: "Verified Successfully", request: { ...request, isScanned: true } };

        } catch (e) {
            console.error("Error scanning QR code: ", e);
            return { success: false, message: "System Error" };
        }
    },
};
