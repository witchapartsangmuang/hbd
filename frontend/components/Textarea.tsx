"use client";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: string;
    resize?: boolean;
};

export function Textarea({ className = "", error, resize = false, ...props }: TextareaProps) {
    return (
        <div className="flex flex-col gap-1">
            <textarea
                {...props}
                className={[
                    "w-full px-3 py-2 rounded-lg border text-sm text-gray-900",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white",
                    resize ? "resize-y" : "resize-none",
                    error ? "border-red-400" : "border-gray-200",
                    className,
                ].join(" ")}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
