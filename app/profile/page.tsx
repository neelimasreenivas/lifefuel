"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [goalWeight, setGoalWeight] = useState("");

    const handleSave = async () => {
        try {
            const user = auth.currentUser;

            if (!user) {
                alert("Please login first");
                return;
            }

            await updateDoc(doc(db, "users", user.uid), {
                name,
                age: Number(age),
                sex,
                heightCm: Number(height),
                weightKg: Number(weight),
                goalWeightKg: Number(goalWeight),

                level: 1,
                xp: 0,
                streak: 0,
            });

            alert("Profile saved successfully!");

            router.push("/dashboard");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <main className="max-w-2xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Complete Your Profile
            </h1>

            <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-3 w-full mb-4 rounded"
            />

            <input
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border p-3 w-full mb-4 rounded"
            />

            <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="border p-3 w-full mb-4 rounded"
            >
                <option value="">Select Sex</option>
                <option>Female</option>
                <option>Male</option>
            </select>

            <input
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border p-3 w-full mb-4 rounded"
            />

            <input
                placeholder="Current Weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border p-3 w-full mb-4 rounded"
            />

            <input
                placeholder="Goal Weight (kg)"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                className="border p-3 w-full mb-4 rounded"
            />

            <button
                onClick={handleSave}
                className="bg-black text-white px-6 py-3 rounded"
            >
                Save Profile
            </button>
        </main>
    );
}