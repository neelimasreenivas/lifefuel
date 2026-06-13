"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

export default function WaterPage() {
    const [water, setWater] = useState(0);

    useEffect(() => {
        loadWater();
    }, []);

    const loadWater = async () => {
        const user = auth.currentUser;

        if (!user) return;

        const today = new Date().toISOString().split("T")[0];

        const docRef = doc(
            db,
            "users",
            user.uid,
            "waterLogs",
            today
        );

        const snap = await getDoc(docRef);

        if (snap.exists()) {
            setWater(snap.data().consumedMl || 0);
        }
    };

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

            // Save water log
            await setDoc(
                doc(db, "users", user.uid, "waterLogs", today),
                {
                    date: today,
                    consumedMl: newTotal,
                    targetMl: 3000,
                    updatedAt: new Date(),
                }
            );

            // Update user stats
            const userRef = doc(db, "users", user.uid);

            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();

                const currentXp = userData.xp || 0;
                const currentLevel = userData.level || 1;
                const currentWater =
                    userData.todayWater || 0;

                const newXp = currentXp + 5;
                const newLevel =
                    Math.floor(newXp / 100) + 1;

                await updateDoc(userRef, {
                    xp: newXp,
                    level: newLevel,
                    todayWater: currentWater + amount,
                });
            }
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