import React from "react";

type FieldProps = {
    label: string;
    hint?: string;
    required?: boolean;
    error?: string;
    tooltip?: React.ReactNode;
    inline?: boolean;
    children: React.ReactNode;
};

export function Field({ label, hint, required, error, tooltip, inline, children }: FieldProps) {
    if (inline) {
        return (
            <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <span className="shrink-0">
                    {label}
                    {required && <span className="ml-1 text-red-400">*</span>}
                </span>
                {children}
                {error && <p className="text-xs text-red-500">{error}</p>}
            </label>
        );
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <span>
                    {label}
                    {required && <span className="ml-1 text-red-400">*</span>}
                    {hint && <span className="ml-2 text-xs text-gray-400 font-normal">{hint}</span>}
                </span>
                {tooltip}
            </label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
