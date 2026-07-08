"use client";

import { useState } from "react";
import ScrollDownButton from "@/components/ScrollDownButton";

export default function NextStepButton({
    nextStep,
    className = "",
    arrowClassName = "",
    disabled = false,
    onPressed,
    children = "Next ▶",
}: {
    nextStep: () => void;
    className?: string;
    arrowClassName?: string;
    disabled?: boolean;
    onPressed?: () => void;
    children?: React.ReactNode;
}) {
    const [pressed, setPressed] = useState(false);

    if (pressed) return <ScrollDownButton className={arrowClassName} />;

    return (
        <button
            type="button"
            onClick={() => {
                setPressed(true);
                nextStep();
                onPressed?.();
            }}
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    );
}
