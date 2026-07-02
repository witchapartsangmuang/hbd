import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { listUsersWithPages } from "@/lib/users";
import CreateUserForm from "./CreateUserForm";
import EditUserDatesForm from "./EditUserDatesForm";

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
          <form action="/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              ออกจากระบบ
            </button>
          </form>
        </div>

        <div className="mb-8 rounded-[24px] border border-rose-100 bg-white/90 p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold text-rose-700">สร้างผู้ใช้ใหม่</h2>
          <CreateUserForm />
        </div>

        <div className="rounded-[24px] border border-rose-100 bg-white/90 p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold text-rose-700">ผู้ใช้ทั้งหมด</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-rose-100 text-rose-500">
                <th className="pb-2">Username</th>
                <th className="pb-2">Slug</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">ช่วงเวลาที่ใช้งานได้</th>
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
                    {user.is_admin ? (
                      "—"
                    ) : (
                      <EditUserDatesForm userId={user.id} startDate={user.start_date} endDate={user.end_date} />
                    )}
                  </td>
                  <td className="py-2 space-x-3">
                    {user.slug && (
                      <>
                        <Link href={`/${user.slug}`} className="text-rose-500 underline">
                          ดู
                        </Link>
                        <Link href={`/${user.slug}/edit`} className="text-rose-500 underline">
                          แก้ไข
                        </Link>
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
