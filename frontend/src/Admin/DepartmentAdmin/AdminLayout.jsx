import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DepartmentAdminLayout() {
  return (
    <div className="flex h-screen bg-grid bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Sidebar />
      <div className="flex-1 p-6 md:p-10 relative z-10 w-full overflow-y-auto overflow-x-hidden pt-20 sm:pt-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
