"use client";

import { useId } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    rectSortingStrategy,
    arrayMove,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandle as DragHandleIcon } from "@/icons/icons";

function SortableItem({
    id,
    children,
}: {
    id: string;
    children: (dragHandle: React.ReactNode) => React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

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
    getItemId?: (item: T, index: number) => string;
    grid?: boolean;
};

export function SortableList<T>({ items, onReorder, children, getItemId, grid }: Props<T>) {
    const dndId = useId();
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const ids = items.map((item, i) => getItemId ? getItemId(item, i) : String(i));

    function handleDragEnd({ active, over }: DragEndEvent) {
        if (!over || active.id === over.id) return;
        const fromIndex = ids.indexOf(String(active.id));
        const toIndex = ids.indexOf(String(over.id));
        if (fromIndex !== -1 && toIndex !== -1) {
            onReorder(arrayMove(items, fromIndex, toIndex));
        }
    }

    return (
        <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={grid ? rectSortingStrategy : verticalListSortingStrategy}>
                {items.map((item, i) => {
                    const id = getItemId ? getItemId(item, i) : String(i);
                    return (
                        <SortableItem key={id} id={id}>
                            {(dragHandle) => children(item, i, dragHandle)}
                        </SortableItem>
                    );
                })}
            </SortableContext>
        </DndContext>
    );
}
