import { AdminDashboardSkeleton } from "@/components/admin/admin-skeletons";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F5F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AdminDashboardSkeleton />
      </div>
    </div>
  );
}
