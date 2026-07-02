import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { listUsersWithPages } from "@/lib/users";
import { Button } from "@/components/Button";
import CreateUserForm from "./CreateUserForm";
import EditUserForm from "./EditUserForm";
import DeleteUserButton from "./DeleteUserButton";

function formatDate(value: Date | string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10);
}

export default async function AdminPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.isAdmin) {
    redirect("/login");
  }

  const users = await listUsersWithPages();

  return (
    <section className="min-h-screen bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-100 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-rose-600">Admin</h1>
          <div className="flex items-center gap-2">
            <CreateUserForm />
            <form action="/logout" method="post">
              <Button type="submit" variant="secondary">
                Log out
              </Button>
            </form>
          </div>
        </div>

        <div className="rounded-[24px] border border-rose-100 bg-white/90 p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold text-rose-700">All Users</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-rose-500">
                <th className="pb-2">Username</th>
                <th className="pb-2">Slug</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Active Period</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-rose-50">
                  <td className="py-2 text-rose-900">{user.username}</td>
                  <td className="py-2 text-rose-900">{user.slug ?? "-"}</td>
                  <td className="py-2 text-rose-900">{user.is_admin ? "admin" : "user"}</td>
                  <td className="py-2 text-rose-900">
                    {user.is_admin ? "—" : `${formatDate(user.start_date)} - ${formatDate(user.end_date)}`}
                  </td>
                  <td className="py-2 space-x-3">
                    {!user.is_admin && (
                      <>
                        {user.slug && (
                          <>
                            <Link href={`/${user.slug}`} className="text-rose-500 underline">
                              Preview
                            </Link>
                            <Link href={`/${user.slug}/edit`} className="text-rose-500 underline">
                              Edit Content
                            </Link>
                          </>
                        )}
                        <EditUserForm
                          userId={user.id}
                          username={user.username}
                          startDate={user.start_date}
                          endDate={user.end_date}
                        />
                        <DeleteUserButton userId={user.id} username={user.username} />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
