import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f0e8de]">
      <Sidebar />
      <div className="lg:pl-[240px] min-h-screen flex flex-col">
        <Topbar userEmail={user.email ?? undefined} />
        <div className="p-3 sm:p-5 lg:p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}
