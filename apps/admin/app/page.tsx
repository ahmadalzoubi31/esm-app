import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  try {
    const [tenantsRes, usersRes] = await Promise.all([
      fetch(`${API_URL}/tenants`, { cache: "no-store" }),
      fetch(`${API_URL}/users`, { cache: "no-store" }),
    ]);

    // NestJS default vs Interceptor wrapper fallback
    const tenantsJson = tenantsRes.ok ? await tenantsRes.json() : [];
    const usersJson = usersRes.ok ? await usersRes.json() : [];

    const tenantsList = Array.isArray(tenantsJson)
      ? tenantsJson
      : tenantsJson.data || [];
    const usersList = Array.isArray(usersJson)
      ? usersJson
      : usersJson.data || [];

    return {
      totalTenants: tenantsList.length,
      activeUsers: usersList.filter((u: any) => u.is_active !== false).length,
    };
  } catch (error) {
    return { totalTenants: 0, activeUsers: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              Registered in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
