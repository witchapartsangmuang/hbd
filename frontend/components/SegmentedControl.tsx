"use client";

import { cx } from "@/lib/format";

type Option = { value: string; label: string };

type SegmentedControlProps = {
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
};

export function SegmentedControl({ options, value, onChange, disabled }: SegmentedControlProps) {
	return (
		<div className="inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
			{options.map((opt) => (
				<button
					key={opt.value}
					type="button"
					disabled={disabled}
					onClick={() => onChange(opt.value)}
					className={cx(
						"h-7 rounded-md px-2.5 text-xs font-medium transition-colors",
						opt.value === value
							? "bg-primary text-on-primary shadow-sm"
							: "text-gray-500 hover:text-gray-700",
						disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
					)}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}
