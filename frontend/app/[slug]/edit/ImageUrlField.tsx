"use client";

import { useState } from "react";
import ImagePickerModal from "./ImagePickerModal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ImageUrlField({
  slug,
  name,
  defaultValue,
  label,
}: {
  slug: string;
  name: string;
  defaultValue: string;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const content = (
    <>
      <div className="flex gap-2">
        <Input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsPickerOpen(true)}
          className="shrink-0"
        >
          เลือกรูปภาพ
        </Button>
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-20 w-20 rounded-lg object-cover" />
      )}
      <ImagePickerModal
        slug={slug}
        open={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => {
          setValue(url);
          setIsPickerOpen(false);
        }}
      />
    </>
  );

  return label ? (
    <Field label={label}>
      {content}
    </Field>
  ) : (
    <div>
      {content}
    </div>
  );
}
