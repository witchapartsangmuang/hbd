import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { listUsersWithPages } from "@/lib/users";
import { Button } from "@/components/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/Table";
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
        <section className="min-h-screen p-6">
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
            <h2 className="mb-4 text-lg font-semibold text-rose-700">All Users</h2>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Username</Th>
                        <Th>Slug</Th>
                        <Th>Role</Th>
                        <Th>Start Date</Th>
                        <Th>End Date</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users.map((user) => (
                        <Tr key={user.id}>
                            <Td className="text-rose-900">{user.username}</Td>
                            <Td className="text-rose-900">{user.slug ?? "-"}</Td>
                            <Td className="text-rose-900">{user.is_admin ? "admin" : "user"}</Td>
                            <Td className="text-rose-900">
                                {user.is_admin ? "—" : `${formatDate(user.start_date)}`}
                            </Td>
                            <Td className="text-rose-900">
                                {user.is_admin ? "—" : `${formatDate(user.end_date)}`}
                            </Td>
                            <Td className="space-x-3">
                                <div className="flex items-center gap-2">
                                    {!user.is_admin && (
                                        <>
                                            {user.slug && (
                                                <>
                                                    <Link
                                                        href={`/${user.slug}`}
                                                        className="text-rose-500 underline"
                                                    >
                                                        Preview
                                                    </Link>
                                                    <Link
                                                        href={`/${user.slug}/edit`}
                                                        className="text-rose-500 underline"
                                                    >
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
                                            <DeleteUserButton
                                                userId={user.id}
                                                username={user.username}
                                            />
                                        </>
                                    )}
                                </div>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </section>
    );
}
