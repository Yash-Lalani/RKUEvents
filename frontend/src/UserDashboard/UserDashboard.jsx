import { useState } from "react";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigation = [
    { name: "Dashboard", id: "dashboard" },
    { name: "Events", id: "orders" },
    { name: "Profile", id: "profile" },
    { name: "Settings", id: "settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 pt-20">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg fixed md:static z-20 inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 w-64`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-blue-600">UserDashboard</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>
        <nav className="mt-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm font-medium hover:bg-gray-100 ${
                activeTab === item.id ? "bg-gray-100 text-blue-600" : ""
              }`}
            >
              <span className="mr-2">•</span>
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden">
          <h2 className="text-xl font-bold text-gray-700">UserDashboard</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 text-lg"
          >
            ☰
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6">
          {activeTab === "dashboard" && <DashboardHome />}
          {activeTab === "Events" && <OrdersSection />}
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

// =======================
// Dashboard Section
// =======================

function DashboardHome() {
  return (
    <>
      <h1 className="text-2xl font-bold">Welcome Back, John!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Orders" value="128" color="green" />
        <Card title="Pending Orders" value="5" color="yellow" />
        <Card title="Total Spent" value="$3,260.00" color="blue" />
      </div>
    </>
  );
}

// =======================
// Orders Section
// =======================

function OrdersSection() {
  return (
    <>
      <h1 className="text-2xl font-bold">Your Orders</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2 font-medium text-gray-500">Order ID</th>
              <th className="px-4 py-2 font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2">#001245</td>
              <td className="px-4 py-2">2025-07-20</td>
              <td className="px-4 py-2 text-green-600">Completed</td>
              <td className="px-4 py-2">$199.99</td>
            </tr>
            <tr>
              <td className="px-4 py-2">#001246</td>
              <td className="px-4 py-2">2025-07-18</td>
              <td className="px-4 py-2 text-yellow-600">Pending</td>
              <td className="px-4 py-2">$49.99</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

// =======================
// Profile Section
// =======================

function ProfileSection() {
  return (
    <>
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="john@example.com"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}

// =======================
// Settings Section
// =======================

function SettingsSection() {
  return (
    <>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-gray-600">Settings section coming soon...</p>
    </>
  );
}

// =======================
// Card Component
// =======================

function Card({ title, value, color }) {
  const colorMap = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
