"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function WaterPage() {
    const [water, setWater] = useState(0);

    const saveWater = async (amount: number) => {
        try {
            const user = auth.currentUser;

            if (!user) {
                alert("Please login first");
                return;
            }

            const newTotal = water + amount;

            setWater(newTotal);

            const today = new Date().toISOString().split("T")[0];

            await setDoc(
                doc(db, "users", user.uid, "waterLogs", today),
                {
                    date: today,
                    consumedMl: newTotal,
                    targetMl: 3000,
                    updatedAt: new Date(),
                }
            );

        } catch (error: any) {
            alert(error.message);
        }
    };

    const percentage = Math.min(
        Math.round((water / 3000) * 100),
        100
    );

    return (
        <main className="max-w-xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Water Tracker 💧
            </h1>

            <div className="border rounded p-6 mb-6 shadow">
                <p className="text-xl mb-2">
                    Goal: 3000 ml
                </p>

                <p className="text-xl mb-4">
                    Consumed: {water} ml
                </p>

                <p className="text-xl font-semibold">
                    Progress: {percentage}%
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => saveWater(250)}
                    className="bg-blue-500 text-white p-3 rounded"
                >
                    +250 ml
                </button>

                <button
                    onClick={() => saveWater(500)}
                    className="bg-blue-500 text-white p-3 rounded"
                >
                    +500 ml
                </button>

                <button
                    onClick={() => saveWater(1000)}
                    className="bg-blue-500 text-white p-3 rounded"
                >
                    +1000 ml
                </button>
            </div>
        </main>
    );
}