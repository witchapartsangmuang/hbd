"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle as DragHandleIcon } from "@/icons/icons";

function SortableItem({ id, children }: { id: string; children: (dragHandle: React.ReactNode) => React.ReactNode }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const dragHandle = (
		<button
			type="button"
			className="cursor-grab active:cursor-grabbing p-1 rounded text-gray-300 hover:text-gray-500 touch-none shrink-0"
			{...attributes}
			{...listeners}
		>
			<DragHandleIcon />
		</button>
	);

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={isDragging ? "opacity-50 relative z-10" : ""}
		>
			{children(dragHandle)}
		</div>
	);
}

type Props<T> = {
	items: T[];
	onReorder: (items: T[]) => void;
	children: (item: T, index: number, dragHandle: React.ReactNode) => React.ReactNode;
};

export function SortableList<T>({ items, onReorder, children }: Props<T>) {
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
	const ids = items.map((_, i) => String(i));

	function handleDragEnd({ active, over }: DragEndEvent) {
		if (!over || active.id === over.id) return;
		onReorder(arrayMove(items, Number(active.id), Number(over.id)));
	}

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={ids} strategy={verticalListSortingStrategy}>
				{items.map((item, i) => (
					<SortableItem key={i} id={String(i)}>
						{(dragHandle) => children(item, i, dragHandle)}
					</SortableItem>
				))}
			</SortableContext>
		</DndContext>
	);
}
