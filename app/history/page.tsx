"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function HistoryPage() {
    const [weights, setWeights] = useState<any[]>([]);

    useEffect(() => {
        fetchWeights();
    }, []);

    const fetchWeights = async () => {
        const user = auth.currentUser;

        if (!user) {
            alert("Please login first");
            return;
        }

        try {
            const q = query(
                collection(db, "users", user.uid, "weightLogs"),
                orderBy("createdAt", "desc")
            );

            const snapshot = await getDocs(q);

            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setWeights(data);
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Weight History 📈
            </h1>

            {/* Chart */}
            <div className="bg-white border rounded p-4 shadow mb-8">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weights}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="morningWeight"
                            stroke="#8884d8"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* History List */}
            {weights.length === 0 ? (
                <p>No weight records found.</p>
            ) : (
                weights.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded p-4 mb-4 shadow"
                    >
                        <p>
                            <strong>Date:</strong> {item.date}
                        </p>

                        <p>
                            <strong>Morning Weight:</strong>{" "}
                            {item.morningWeight} kg
                        </p>

                        <p>
                            <strong>Evening Weight:</strong>{" "}
                            {item.eveningWeight} kg
                        </p>
                    </div>
                ))
            )}
        </main>
    );
}