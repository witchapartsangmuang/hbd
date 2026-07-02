"use client";

import { useActionState, useState } from "react";
import { deleteUserAction } from "./actions";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";

const initialState = { error: null as string | null };

export default function DeleteUserButton({ userId, username }: { userId: number; username: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const boundAction = deleteUserAction.bind(null, userId);

  const [state, formAction, isPending] = useActionState(async (_prev: typeof initialState, _formData: FormData) => {
    const result = await boundAction();
    if (!result.error) setIsOpen(false);
    return result;
  }, initialState);

  return (
    <>
      <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        Delete
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm User Deletion"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <form action={formAction}>
              <Button type="submit" variant="danger" loading={isPending}>
                Delete User
              </Button>
            </form>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-gray-900">{username}</span>? Their page
          and all associated data will be permanently deleted and cannot be recovered.
        </p>
        {state.error && <p className="mt-2 text-sm font-medium text-rose-500">{state.error}</p>}
      </Modal>
    </>
  );
}
