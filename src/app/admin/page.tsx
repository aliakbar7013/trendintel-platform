import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAdminDashboardStats, getSiteSettings } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect("/admin/login");
  }

  const [stats, settings] = await Promise.all([
    getAdminDashboardStats(),
    getSiteSettings(),
  ]);

  return <AdminDashboard initialStats={stats} initialSettings={settings} />;
}
