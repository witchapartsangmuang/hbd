"use client";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md";
    loading?: boolean;
};

const VARIANT: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-(--theme-primary) text-(--theme-on-primary) hover:bg-(--theme-primary-dark) disabled:opacity-50",
    secondary: "border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50",
    ghost: "text-gray-600 hover:bg-gray-100 disabled:opacity-50",
};

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-8 px-3 text-xs rounded-lg",
    md: "h-10 px-5 text-sm rounded-xl",
};

export function Button({
    variant = "primary",
    size = "md",
    loading,
    disabled,
    children,
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={[
                "font-semibold transition-colors flex items-center justify-center gap-2",
                VARIANT[variant],
                SIZE[size],
                className,
            ].join(" ")}
        >
            {loading && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}
