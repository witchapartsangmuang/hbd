"use client";

import { useEffect, useState } from "react";

type ToastVariant = "success" | "error";

type ToastProps = {
    message: string;
    variant?: ToastVariant;
    duration?: number;
    onDismiss: () => void;
};

export function Toast({ message, variant = "success", duration = 3000, onDismiss }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const show = requestAnimationFrame(() => setVisible(true));
        const hide = setTimeout(() => setVisible(false), duration - 300);
        const dismiss = setTimeout(onDismiss, duration);
        return () => {
            cancelAnimationFrame(show);
            clearTimeout(hide);
            clearTimeout(dismiss);
        };
    }, [duration, onDismiss]);

    return (
        <div
            className={[
                "fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl",
                "text-sm font-semibold transition-all duration-300",
                variant === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-rose-500 text-white",
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            ].join(" ")}
        >
            <span>{variant === "success" ? "✓" : "✕"}</span>
            {message}
        </div>
    );
}
