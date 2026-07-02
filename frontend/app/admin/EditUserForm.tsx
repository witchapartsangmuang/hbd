"use client";

import { useActionState, useState } from "react";
import { updateUserAction } from "./actions";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";

const initialState = { error: null as string | null };

function toDateInputValue(value: Date | string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function EditUserForm({
  userId,
  username,
  startDate,
  endDate,
}: {
  userId: number;
  username: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const boundAction = updateUserAction.bind(null, userId);

  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await boundAction(formData);
    if (!result.error) setIsOpen(false);
    return result;
  }, initialState);

  return (
    <>
      <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        Edit
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Edit User: ${username}`}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form={`edit-user-form-${userId}`} loading={isPending}>
              Save
            </Button>
          </>
        }
      >
        <form id={`edit-user-form-${userId}`} action={formAction} className="flex flex-col gap-4">
          <Field label="Username" required>
            <Input type="text" name="username" defaultValue={username} required />
          </Field>
          <Field label="Password" hint="Leave blank to keep the current password">
            <Input type="password" name="password" placeholder="New password" minLength={8} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date" required>
              <Input type="date" name="startDate" defaultValue={toDateInputValue(startDate)} required />
            </Field>
            <Field label="End Date" required>
              <Input type="date" name="endDate" defaultValue={toDateInputValue(endDate)} required />
            </Field>
          </div>
          {state.error && <p className="text-sm font-medium text-rose-500">{state.error}</p>}
        </form>
      </Modal>
    </>
  );
}
