"use client";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
};

export function Input({ className = "", error, ...props }: InputProps) {
    const isFile = props.type === "file";

    return (
        <div className="flex flex-col gap-1">
            <input
                {...props}
                className={[
                    "w-full rounded-lg border text-sm text-gray-900",
                    isFile
                        ? [
                              "cursor-pointer bg-white",
                              "file:mr-3 file:h-full file:cursor-pointer file:border-0 file:border-r",
                              "file:bg-gray-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-600",
                              "file:transition-colors file:hover:bg-gray-100",
                              error
                                  ? "border-red-400 file:border-red-400"
                                  : "border-gray-200 file:border-gray-200",
                          ].join(" ")
                        : [
                              "h-10 px-3",
                              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white",
                              error ? "border-red-400" : "border-gray-200",
                          ].join(" "),
                    className,
                ].join(" ")}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
