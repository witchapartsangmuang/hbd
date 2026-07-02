"use client";

import { useActionState, useRef, useState } from "react";
import { createUserAction } from "./actions";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";

const initialState = { error: null as string | null };

export default function CreateUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, formData: FormData) => {
    const result = await createUserAction(formData);
    if (!result.error) {
      setIsOpen(false);
      formRef.current?.reset();
    }
    return result;
  }, initialState);

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        + Add User
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New User"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="create-user-form" loading={isPending}>
              Create
            </Button>
          </>
        }
      >
        <form ref={formRef} id="create-user-form" action={formAction} className="flex flex-col gap-4">
          <Field label="Username" required>
            <Input type="text" name="username" placeholder="Username" required />
          </Field>
          <Field label="Password" hint="At least 8 characters" required>
            <Input type="password" name="password" placeholder="Password" required minLength={8} />
          </Field>
          <Field label="Confirm Password" required>
            <Input type="password" name="confirmPassword" placeholder="Confirm Password" required minLength={8} />
          </Field>
          <Field label="Slug" hint="e.g. alice-bday" required>
            <Input
              type="text"
              name="slug"
              placeholder="Slug, e.g. alice-bday"
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date" required>
              <Input type="date" name="startDate" required />
            </Field>
            <Field label="End Date" required>
              <Input type="date" name="endDate" required />
            </Field>
          </div>
          {state.error && <p className="text-sm font-medium text-rose-500">{state.error}</p>}
        </form>
      </Modal>
    </>
  );
}
