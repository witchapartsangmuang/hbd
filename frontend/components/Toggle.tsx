"use client";

type ToggleProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	label?: string;
	invalid?: boolean;
};

export function Toggle({ checked, onChange, disabled = false, label, invalid }: ToggleProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={label}
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={[
				"relative w-11 h-6 rounded-full transition-colors shrink-0",
				checked ? "bg-primary" : "bg-gray-200",
				disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
				invalid ? "ring-1 ring-red-400 ring-offset-1" : "",
			].join(" ")}
		>
			<span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-6" : "left-1"}`} />
		</button>
	);
}
