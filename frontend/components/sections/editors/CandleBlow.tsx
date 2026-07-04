"use client";

import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { panelClass, SectionEditorProps } from "./_shared";

export default function CandleBlowEditor({
    content,
    slug,
    hidden,
    sectionId,
}: SectionEditorProps) {
    return (
        <div className={hidden ? "hidden" : ""}>
            <div className={panelClass}>
                <h2 className="mb-4 text-lg font-semibold text-rose-700">Blow the Candle</h2>
                <Field label="Number of candles">
                    <Input
                        type="number"
                        name={`candleBlow.${sectionId}.candleCount`}
                        defaultValue={content.candleBlow?.[sectionId]?.candleCount ?? 3}
                        min={1}
                        max={10}
                    />
                </Field>
                <div className="mt-3">
                    <Field label="Message">
                        <Input
                            name={`candleBlow.${sectionId}.message`}
                            defaultValue={content.candleBlow?.[sectionId]?.message ?? ""}
                        />
                    </Field>
                </div>
            </div>
        </div>
    );
}
