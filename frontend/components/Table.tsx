import React, { useState, useEffect } from "react";
import { cx } from "@/lib/format";

/* ── Sub-components ──────────────────────────────── */

function Thead({ children, className }: { children: React.ReactNode; className?: string }) {
	return <thead className={cx(className)}>{children}</thead>;
}

function Tbody({ children, className }: { children: React.ReactNode; className?: string }) {
	return <tbody className={cx(className)}>{children}</tbody>;
}

function Tfoot({ children, className }: { children: React.ReactNode; className?: string }) {
	return <tfoot className={cx("border-t border-gray-100 bg-gray-50", className)}>{children}</tfoot>;
}

function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<tr className={cx("border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-none", className)}>
			{children}
		</tr>
	);
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<th className={cx("text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3", className)}>
			{children}
		</th>
	);
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
	return <td className={cx("px-4 py-3.5", className)}>{children}</td>;
}

/* ── Pagination controls ─────────────────────────── */

function Pagination({
	current,
	total,
	onChange,
	colSpan,
}: {
	current: number;
	total: number;
	onChange: (p: number) => void;
	colSpan: number;
}) {
	if (total <= 1) return null;

	/* Build the visible page-number list with at most 7 slots */
	const pages: (number | "…")[] = [];
	if (total <= 7) {
		for (let i = 1; i <= total; i++) pages.push(i);
	} else {
		pages.push(1);
		if (current > 4) pages.push("…");
		const start = Math.max(2, current - 1);
		const end = Math.min(total - 1, current + 1);
		for (let i = start; i <= end; i++) pages.push(i);
		if (current < total - 3) pages.push("…");
		pages.push(total);
	}

	const btn = (label: React.ReactNode, page: number, disabled: boolean, active = false) => (
		<button
			key={String(label)}
			onClick={() => !disabled && onChange(page)}
			disabled={disabled}
			className={cx(
				"min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-colors",
				active
					? "bg-primary text-on-primary"
					: disabled
						? "text-gray-300 cursor-not-allowed"
						: "text-gray-500 hover:bg-gray-100",
			)}
		>
			{label}
		</button>
	);

	return (
		<tfoot>
			<tr>
				<td colSpan={colSpan} className="px-4 py-3 border-t border-gray-100">
					<div className="flex items-center justify-between gap-2">
						<span className="text-xs text-gray-400">Page {current} of {total}</span>
						<div className="flex items-center gap-1">
							{btn("←", current - 1, current === 1)}
							{pages.map((p, i) =>
								p === "…"
									? <span key={`ellipsis-${i}`} className="min-w-8 h-8 flex items-center justify-center text-xs text-gray-300">…</span>
									: btn(p, p, false, p === current)
							)}
							{btn("→", current + 1, current === total)}
						</div>
					</div>
				</td>
			</tr>
		</tfoot>
	);
}

/* ── Column-based generic API ────────────────────── */

export type Column<T> = {
	key: string;
	label: string;
	render: (row: T) => React.ReactNode;
	className?: string;
	headClassName?: string;
};

type TableProps<T> = {
	/* generic mode */
	columns?: Column<T>[];
	data?: T[];
	rowKey?: (row: T) => string;
	pageSize?: number;
	/* compound mode */
	children?: React.ReactNode;
	/* shared */
	loading?: boolean;
	empty?: React.ReactNode;
	className?: string;
};

function Table<T>({
	columns,
	data,
	rowKey,
	pageSize,
	children,
	loading,
	empty,
	className,
}: TableProps<T>) {
	const isGeneric = columns && data && rowKey;
	const [currentPage, setCurrentPage] = useState(1);

	/* Reset to page 1 whenever the data set changes */
	useEffect(() => { setCurrentPage(1); }, [data]);

	let inner: React.ReactNode;

	if (loading) {
		inner = (
			<div className="flex items-center justify-center py-16 text-gray-400 text-sm animate-pulse">
				Loading...
			</div>
		);
	} else if (isGeneric && data.length === 0) {
		inner = (
			<div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-300 text-sm">
				{empty ?? "No data"}
			</div>
		);
	} else if (isGeneric) {
		const totalPages = pageSize ? Math.ceil(data.length / pageSize) : 1;
		const page = Math.min(currentPage, Math.max(1, totalPages));
		const sliced = pageSize ? data.slice((page - 1) * pageSize, page * pageSize) : data;

		inner = (
			<table className="w-full text-sm">
				<Thead>
					<tr className="bg-gray-50 border-b border-gray-100">
						{columns.map((col) => (
							<Th key={col.key} className={col.headClassName}>
								{col.label}
							</Th>
						))}
					</tr>
				</Thead>
				<Tbody>
					{sliced.map((row) => (
						<Tr key={rowKey(row)}>
							{columns.map((col) => (
								<Td key={col.key} className={col.className}>
									{col.render(row)}
								</Td>
							))}
						</Tr>
					))}
				</Tbody>
				<Pagination
					current={page}
					total={totalPages}
					onChange={setCurrentPage}
					colSpan={columns.length}
				/>
			</table>
		);
	} else {
		inner = <table className="w-full text-sm">{children}</table>;
	}

	return (
		<div className={cx("bg-white rounded-2xl border border-gray-100 shadow-sm", className)}>
			{inner}
		</div>
	);
}

/* ── Attach sub-components ───────────────────────── */
Table.Thead = Thead;
Table.Tbody = Tbody;
Table.Tfoot = Tfoot;
Table.Tr = Tr;
Table.Th = Th;
Table.Td = Td;

export { Table };
