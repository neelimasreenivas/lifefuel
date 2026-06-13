"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("Account created successfully!");
            router.push("/dashboard");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md border p-8 rounded-lg shadow">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Create Account
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleSignup}
                    className="w-full bg-black text-white p-3 rounded"
                >
                    Sign Up
                </button>
            </div>
        </main>
    );
}