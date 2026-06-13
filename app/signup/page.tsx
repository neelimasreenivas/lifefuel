"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            // Create Firebase Auth account
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            // Create Firestore user document
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                level: 1,
                xp: 0,
                streak: 0,
                createdAt: new Date(),
            });

            alert("Account created successfully!");

            router.push("/dashboard");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="w-[500px] border p-10 rounded-lg">
                <h1 className="text-5xl font-bold text-center mb-8">
                    Create Account
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-4 rounded mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-4 rounded mb-4"
                />

                <button
                    onClick={handleSignup}
                    className="w-full bg-black text-white p-4 rounded"
                >
                    Sign Up
                </button>
            </div>
        </main>
    );
}