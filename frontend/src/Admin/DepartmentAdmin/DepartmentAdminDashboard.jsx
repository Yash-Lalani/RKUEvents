import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const DepartmentAdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const department = user?.department;

  const [cards, setCards] = useState({
    totalEvents: 0,
    registrations: 0,
  });

  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [deptEvents, setDeptEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#14b8a6", "#0ea5e9", "#6366f1", "#eab308", "#f43f5e"];

  const months = ["Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [cardsRes, monthlyRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/department-stats/cards/${department}`),
        axios.get(`http://localhost:5000/api/department-stats/monthly/${department}`),
      ]);

      setCards(cardsRes.data);

      setMonthlyRegistrations(
        monthlyRes.data.map(item => ({
          month: months[item._id - 1],
          count: item.count,
        }))
      );

      setDeptEvents([{ name: department, value: cardsRes.data.totalEvents }]);

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex">
    

      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-teal-600 mb-8 text-center">
          {department} Department Dashboard
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-500 text-sm">Department Events</h2>
            <p className="text-3xl font-bold text-indigo-600">
              {cards.totalEvents}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
            <h2 className="text-gray-500 text-sm">
              Registrations (Department Wise)
            </h2>
            <p className="text-3xl font-bold text-rose-600">
              {cards.registrations}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          
          {/* Monthly Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Monthly Registrations
            </h3>
            <LineChart width={450} height={280} data={monthlyRegistrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#14b8a6"
                strokeWidth={3}
              />
            </LineChart>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Events in Your Department
            </h3>
            <PieChart width={450} height={280}>
              <Pie
                data={deptEvents}
                dataKey="value"
                outerRadius={100}
                label
              >
                {deptEvents.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg mt-10">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Registration Growth Overview
          </h3>
          <BarChart width={900} height={300} data={monthlyRegistrations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Legend />
            <Tooltip />
            <Bar dataKey="count" fill="#0ea5e9" />
          </BarChart>
        </div>
      </main>
    </div>
  );
};

export default DepartmentAdminDashboard;
