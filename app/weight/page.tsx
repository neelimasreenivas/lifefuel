"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

export default function WeightPage() {
    const [morningWeight, setMorningWeight] = useState("");
    const [eveningWeight, setEveningWeight] = useState("");

    const saveWeight = async () => {
        try {
            const user = auth.currentUser;

            if (!user) {
                alert("Please login first");
                return;
            }

            // Save weight log
            await addDoc(
                collection(db, "users", user.uid, "weightLogs"),
                {
                    date: new Date().toISOString().split("T")[0],
                    morningWeight: Number(morningWeight),
                    eveningWeight: Number(eveningWeight),
                    createdAt: new Date(),
                }
            );

            // Update XP, Level & Streak
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();

                const currentXp = userData.xp || 0;
                const currentLevel = userData.level || 1;

                const newXp = currentXp + 10;
                const newLevel = Math.floor(newXp / 100) + 1;

                const today = new Date().toISOString().split("T")[0];

                let newStreak = userData.streak || 0;
                const lastActivityDate =
                    userData.lastActivityDate || "";

                if (lastActivityDate !== today) {
                    newStreak += 1;
                }

                await updateDoc(userRef, {
                    xp: newXp,
                    level: newLevel,
                    streak: newStreak,
                    lastActivityDate: today,
                });
            }

            alert("Weight saved successfully!");

            setMorningWeight("");
            setEveningWeight("");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <main className="max-w-xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Weight Tracker ⚖️
            </h1>

            <input
                type="number"
                placeholder="Morning Weight (kg)"
                value={morningWeight}
                onChange={(e) => setMorningWeight(e.target.value)}
                className="border p-3 rounded w-full mb-4"
            />

            <input
                type="number"
                placeholder="Evening Weight (kg)"
                value={eveningWeight}
                onChange={(e) => setEveningWeight(e.target.value)}
                className="border p-3 rounded w-full mb-4"
            />

            <button
                onClick={saveWeight}
                className="bg-black text-white px-6 py-3 rounded"
            >
                Save Weight
            </button>
        </main>
    );
}