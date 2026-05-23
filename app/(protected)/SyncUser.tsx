'use client'
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export function SyncUser(){
    useEffect(() => {
        fetch("/api/syncUser")
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    if (data.userId) {
                        Sentry.setUser({ id: data.userId });
                    }
                }
            })
            .catch(console.error);
    }, []);
    return null
}