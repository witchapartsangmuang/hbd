type BreadcrumbItem = { id: number; name: string };

export function Breadcrumb({
	items,
	currentId,
	onSelect,
	rootLabel = "Root",
}: {
	items: BreadcrumbItem[];
	currentId: number | null;
	onSelect: (id: number | null) => void;
	rootLabel?: string;
}) {
	return (
		<nav className="flex items-center gap-1 text-sm">
			<button
				onClick={() => onSelect(null)}
				className={`hover:text-primary transition-colors ${currentId === null ? "text-gray-900 font-semibold" : "text-gray-400"}`}
			>
				{rootLabel}
			</button>
			{items.map((item) => (
				<span key={item.id} className="flex items-center gap-1">
					<span className="text-gray-300">/</span>
					<button
						onClick={() => onSelect(item.id)}
						className={`hover:text-primary transition-colors ${currentId === item.id ? "text-gray-900 font-semibold" : "text-gray-400"}`}
					>
						{item.name}
					</button>
				</span>
			))}
		</nav>
	);
}
