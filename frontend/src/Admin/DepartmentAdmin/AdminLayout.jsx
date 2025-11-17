import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DepartmentAdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
