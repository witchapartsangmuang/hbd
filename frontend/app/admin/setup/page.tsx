import { redirect } from "next/navigation";
import { countAdmins } from "@/lib/users";
import SetupForm from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
    const adminCount = await countAdmins();
    if (adminCount > 0) {
        redirect("/login");
    }

    return (
        <section className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-100 p-5">
            <div className="w-full max-w-sm rounded-[28px] border border-rose-100 bg-white/90 p-6 shadow-xl backdrop-blur">
                <h1 className="mb-2 text-center text-2xl font-bold text-rose-600">Initial Setup</h1>
                <p className="mb-6 text-center text-sm text-rose-900/70">
                    Create the first admin account for this system
                </p>
                <SetupForm />
            </div>
        </section>
    );
}
