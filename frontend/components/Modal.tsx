"use client";

import { useEffect } from "react";

type ModalProps = {
	open: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	children?: React.ReactNode;
	footer?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
};

const SIZE: Record<NonNullable<ModalProps["size"]>, string> = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
			<div
				className={`relative bg-white rounded-2xl shadow-2xl w-full mx-4 flex flex-col gap-5 p-6 ${SIZE[size]}`}
				role="dialog"
				aria-modal
				aria-labelledby={title ? "modal-title" : undefined}
			>
				{(title || description) && (
					<div>
						{title && <h2 id="modal-title" className="text-lg font-bold text-gray-900">{title}</h2>}
						{description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
					</div>
				)}

				<button
					onClick={onClose}
					aria-label="Close"
					className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none"
				>
					✕
				</button>

				<div className="flex flex-col gap-4">{children}</div>

				{footer && <div className="flex gap-3 pt-1">{footer}</div>}
			</div>
		</div>
	);
}
