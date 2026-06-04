import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen relative bg-gray-50 flex overflow-hidden">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
        <AdminSidebar />
      </div>
      <main className="md:pl-72 flex-1 flex flex-col h-full w-full">
        <AdminNavbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}
