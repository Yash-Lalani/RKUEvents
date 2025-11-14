import Sidebar from "./Sidebar";

function DepartmentAdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        {/* Content goes here */}
        <h1 className="text-2xl font-semibold">Welcome to Department Admin Dashboard</h1>
      </main>
    </div>
  );
}

export default DepartmentAdminDashboard;
