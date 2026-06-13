"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

import {
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

import {
    doc,
    getDoc,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [level, setLevel] = useState(0);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (user) => {
                if (!user) {
                    router.push("/login");
                    return;
                }

                const docRef = doc(
                    db,
                    "users",
                    user.uid
                );

                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    setEmail(data.email || "");
                    setLevel(data.level || 0);
                    setXp(data.xp || 0);
                    setStreak(data.streak || 0);
                }
            }
        );

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    return (
        <main className="min-h-screen p-10">
            <h1 className="text-4xl font-bold mb-6">
                Welcome to LifeFuel 🚀
            </h1>

            <div className="space-y-2 text-xl">
                <p>Email: {email}</p>
                <p>Level: {level}</p>
                <p>XP: {xp}</p>
                <p>Streak: {streak}</p>
            </div>

            <button
                onClick={handleLogout}
                className="mt-8 bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </main>
    );
}