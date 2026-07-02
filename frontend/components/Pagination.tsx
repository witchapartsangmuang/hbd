import React, { useState, useEffect } from "react";
import { SegmentedControl } from "@/components/SegmentedControl";

type PaginationProps = {
	total: number;
	page: number;
	pageSize: number | null;
	pageSizeOptions?: number[];
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number | null) => void;
};

export function Pagination({
	total,
	page,
	pageSize,
	pageSizeOptions = [10, 20, 50, 100],
	onPageChange,
	onPageSizeChange,
}: PaginationProps) {
	const totalPages = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
	const [goTo, setGoTo] = useState(String(page));

	const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
		.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
		.reduce<(number | "…")[]>((acc, p, idx, arr) => {
			if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
			acc.push(p);
			return acc;
		}, []);

	useEffect(() => { setGoTo(String(page)); }, [page]);

	function handleGoTo(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key !== "Enter") return;
		const n = parseInt(goTo, 10);
		if (!isNaN(n) && n >= 1 && n <= totalPages) onPageChange(n);
		setGoTo("");
	}

	const btnBase = "w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors";

	return (
		<div className="flex items-center justify-between gap-4 text-sm flex-wrap">
			{/* Left: summary + rows per page */}
			<div className="flex items-center gap-3 flex-wrap">
				<span className="text-gray-400">
					{pageSize
						? total === 0
							? `0 of 0 entries`
							: `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total} entries`
						: `Showing all ${total} entries`}
				</span>
				<div className="flex items-center gap-1.5">
					<span className="text-xs text-gray-400">Rows per page</span>
					<SegmentedControl
						options={[
							...pageSizeOptions.map((s) => ({ value: String(s), label: String(s) })),
							{ value: "all", label: "All" },
						]}
						value={pageSize === null ? "all" : String(pageSize)}
						onChange={(v: string) => { onPageSizeChange(v === "all" ? null : Number(v)); onPageChange(1); }}
					/>
				</div>
			</div>

			{/* Right: page nav + go to */}
			{pageSize && totalPages > 1 && (
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1">
						<button onClick={() => onPageChange(1)} disabled={page === 1} className={btnBase} title="First page">«</button>
						<button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className={btnBase}>‹</button>
						{pageNumbers.map((p, i) =>
							p === "…" ? (
								<span key={`el-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-300 text-xs">…</span>
							) : (
								<button
									key={p}
									onClick={() => onPageChange(p)}
									className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${p === page ? "bg-primary text-on-primary border border-primary" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
								>{p}</button>
							)
						)}
						<button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className={btnBase}>›</button>
						<button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} className={btnBase} title="Last page">»</button>
					</div>
					<div className="flex items-center gap-1.5 ml-2">
						<span className="text-xs text-gray-400">Go to</span>
						<input
							type="number"
							min={1}
							max={totalPages}
							value={goTo}
							onChange={(e) => setGoTo(e.target.value)}
							onKeyDown={handleGoTo}
							placeholder={String(page)}
							className="w-12 h-8 px-2 text-xs text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
						/>
						<span className="text-xs text-gray-400">page</span>
					</div>
				</div>
			)}
		</div>
	);
}
