# hbd — Birthday Page Builder

A personalized digital birthday-greeting page builder. An admin creates user accounts; each
non-admin user gets exactly one shareable page at `/[slug]`, assembled from an ordered list of
interactive "sections" (scratch cards, mini-games, cinematic animal reveals, cake, typing text,
etc.) that the recipient unlocks one at a time by completing each one.

## Stack & commands

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Database: raw `pg` (`lib/db.ts`) — no ORM, no query builder, hand-written parameterized SQL
- `@vercel/blob` for uploaded media, `@dnd-kit` for drag-and-drop section reordering in the editor

```
npm run dev     # runs `bun scripts/migrate.ts` then `next dev -p 3003` — needs bun installed globally
npm run build   # next build (no migration step)
npm run start   # next start -p 3003
npm run format  # prettier --write over app/, components/, lib/
```

- Dev/start are pinned to **port 3003**, not 3000.
- `npm run lint` currently crashes with a circular-JSON error inside `eslint-config-next`'s flat
  config compat layer — this is a pre-existing environment issue, not something a normal code
  change will fix. Don't spend time debugging it unless asked to.
- Prettier config is non-default: 4-space indent, double quotes, semicolons, `printWidth: 100`,
  trailing commas (`es5`). Run `npm run format` after editing.

## The section system (read this before adding a section)

Every page is `content.sections: SectionInstance[]` — an ordered, enable/disable-able list of
`{ id, type, enabled, label? }`. Adding a **new section type** means touching five places in sync;
missing one leaves the type half-wired:

1. **`components/sections/utils/content-types.ts`** — add the type to the `SectionType` union,
   `SECTION_TYPES` array, `SECTION_LABELS` record, add its content shape to the `HbdContent`
   interface, seed it in `defaultContent`, and merge it in `mergeWithDefaults`.
2. **`components/sections/editors/<Name>.tsx`** — the actual component. Props are always
   `{ nextStep: () => void; content: HbdContent }`. Call `nextStep()` when the interaction is done
   to unlock the next section.
3. **`components/sections/_sections.tsx`** — register `{ label, component }` in
   `SECTION_REGISTRY` under the new `SectionType` key.
4. **`app/[slug]/edit/SectionEditor.tsx`** — add a config panel (conditional `<div>` keyed on
   `selected?.type === "..."`) with the editable fields, or add the type to `NO_CONFIG_TYPES` if it
   has nothing to configure.
5. **`app/[slug]/edit/actions.ts`** (`saveContentAction`) — read the new form field(s) out of
   `formData` and merge them into `updated`, falling back to `existing.<field>` when absent.

Field-encoding conventions already in use, follow them instead of building new list-editing UI:

- A flat string list (e.g. wishes, prizes) → one `<Textarea>`, newline-separated, split/trim/filter
  on save.
- A list of objects (e.g. quiz questions, timeline items, guestbook entries) → one `<Textarea>`
  holding raw JSON, parsed with a small type-guard + `parseJsonArray` helper in `actions.ts`,
  falling back to the existing value on invalid JSON.
- Image/video fields → reuse `ImageUrlField` / `VideoUrlField` (they call the existing
  `uploadImageAction` / `uploadVideoAction`). There is no upload action for audio — audio fields
  (voice message, background music) are plain URL `<Input>`s pointing at an already-hosted file.

`HbdExperience.tsx` renders sections top-to-bottom and reveals them progressively via
`unlockedCount`; already-unlocked sections stay mounted and visible (not unmounted), which is why
an ambient section like background music can keep playing after `nextStep()` fires.

## Auth & sessions

- Passwords: `scrypt` + random salt, stored as `salt:hex(hash)` (`lib/auth.ts`). Not bcrypt.
- Sessions: a hand-rolled HMAC-SHA256-signed cookie (`lib/session.ts`), not a JWT library. Cookie
  name `hbd_session`, 7-day expiry embedded in the signed payload, `httpOnly`, `secure` in
  production only.
- First-run admin setup is special: `app/admin/setup` only works while `countAdmins() === 0` — once
  an admin exists it redirects to `/login`. Submitting it creates the user as admin *and*
  immediately calls `createSessionCookie(...)`, logging them in without going through the normal
  login/password-verify path.

## Database

- `lib/schema.sql` is the entire schema (`users`, `pages`, all `CREATE TABLE IF NOT EXISTS`).
  **There is no migration history** — `scripts/migrate.ts` just re-runs this one file wholesale on
  every `npm run dev`. To change the schema, edit `schema.sql` directly; there's no separate
  numbered-migration step to author.
- `pages.content` is a single `JSONB` column holding the whole `HbdContent` object — no per-section
  tables. One page per non-admin user (`pages_user_id_idx` is a unique index); `pages.slug` is what
  the public URL uses.
