"use client";

import ImageUrlField from "@/app/[slug]/edit/ImageUrlField";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { panelClass, SectionEditorProps } from "./_shared";

export default function JigsawPhotoPuzzleEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-(--theme-primary-dark)">Jigsaw Puzzle</h2>
                <ImageUrlField
                    slug={slug}
                    name={`jigsawPhotoPuzzle.${sectionId}.imagePath`}
                    defaultValue={content.jigsawPhotoPuzzle?.[sectionId]?.imagePath ?? ""}
                    label="Puzzle image"
                />
                <div className="mt-3">
                    <Field label="Grid size (e.g. 3 = 3x3)">
                        <Input
                            type="number"
                            name={`jigsawPhotoPuzzle.${sectionId}.gridSize`}
                            defaultValue={content.jigsawPhotoPuzzle?.[sectionId]?.gridSize ?? 3}
                            min={2}
                            max={5}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
