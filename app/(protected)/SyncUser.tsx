'use client'
import { useEffect } from "react";
export function SyncUser(){
    useEffect(() => {
        fetch("/api/syncUser").catch(console.error);
    }, []);
    return null
}