"use client";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	options?: { value: string; label: string }[];
	error?: string;
};

export function Select({ options, children, className = "", error, ...props }: SelectProps) {
	return (
		<div className="flex flex-col gap-1">
			<select
				{...props}
				className={[
					"w-full h-10 px-3 rounded-lg border text-sm text-gray-900",
					"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none",
					error ? "border-red-400" : "border-gray-200",
					className,
				].join(" ")}
			>
				{options
					? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)
					: children}
			</select>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
}
