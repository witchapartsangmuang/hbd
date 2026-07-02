"use client";

import { useState, useRef, useEffect, useId } from "react";

export type SearchSelectOption = { value: string; label: string; desc?: string };

type SearchSelectProps = {
    value: string;
    onChange: (value: string) => void;
    options: SearchSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    error?: string;
};

export function SearchSelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    error,
}: SearchSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const selected = options.find((o) => o.value === value);
    const filtered = query
        ? options.filter(
              (o) =>
                  o.label.toLowerCase().includes(query.toLowerCase()) ||
                  o.desc?.toLowerCase().includes(query.toLowerCase())
          )
        : options;

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    function select(opt: SearchSelectOption) {
        onChange(opt.value);
        setOpen(false);
        setQuery("");
    }

    return (
        <div ref={containerRef} className="relative" id={id}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={[
                    "w-full h-10 px-3 rounded-lg border text-sm text-left flex items-center justify-between bg-white",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    error ? "border-red-400" : "border-gray-200",
                    !selected ? "text-gray-400" : "text-gray-900",
                ].join(" ")}
            >
                <span className="truncate">{selected ? selected.label : placeholder}</span>
                <svg
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {open && (
                <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full h-8 px-3 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                    </div>
                    <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
                        {filtered.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-400 text-center">
                                No results found
                            </li>
                        )}
                        {filtered.map((o) => (
                            <li
                                key={o.value}
                                role="option"
                                aria-selected={o.value === value}
                                onClick={() => select(o)}
                                className={[
                                    "flex flex-col px-3 py-2 cursor-pointer text-sm transition-colors",
                                    o.value === value
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-50",
                                ].join(" ")}
                            >
                                <span className="font-medium">{o.label}</span>
                                {o.desc && <span className="text-xs text-gray-400">{o.desc}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
