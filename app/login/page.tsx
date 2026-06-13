"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            console.log(userCredential.user);
            router.push("/dashboard");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md border p-8 rounded-lg shadow">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Login to LifeFuel
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
                    onClick={handleLogin}
                    className="w-full bg-black text-white p-3 rounded"
                >
                    Login
                </button>
            </div>
        </main>
    );
}