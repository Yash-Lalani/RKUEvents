import React, { useEffect, useState } from "react";
import axios from "axios";
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

const Dashboard = () => {
  const [cards, setCards] = useState({
    totalEvents: 0,
    totalUsers: 0,
    registrations: 0,
  });

  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [deptWiseEvents, setDeptWiseEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#14b8a6", "#0ea5e9", "#6366f1", "#eab308", "#f43f5e"];

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug",
  "Sep","Oct","Nov","Dec"];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [cardsRes, monthlyRes, deptRes] = await Promise.all([
        axios.get("http://localhost:5000/api/stats/cards"),
        axios.get("http://localhost:5000/api/stats/monthly-registrations"),
        axios.get("http://localhost:5000/api/stats/events-department"),
      ]);

      setCards(cardsRes.data);

      setMonthlyRegistrations(
        monthlyRes.data.map(item => ({
          month: months[item._id - 1],
          count: item.count,
        }))
      );

      setDeptWiseEvents(
        deptRes.data.map(item => ({
          name: item._id,
          value: item.value,
        }))
      );

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-xl text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-teal-600 mb-8 text-center">
        Super Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-gray-500 text-sm">Total Events</h2>
          <p className="text-3xl font-bold text-indigo-600">{cards.totalEvents}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-gray-500 text-sm">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">{cards.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-gray-500 text-sm">Registrations</h2>
          <p className="text-3xl font-bold text-rose-600">{cards.registrations}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Monthly Registrations
          </h3>
          <LineChart width={450} height={280} data={monthlyRegistrations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={3} />
          </LineChart>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Events Per Department
          </h3>
          <PieChart width={450} height={280}>
            <Pie data={deptWiseEvents} dataKey="value" outerRadius={100} label>
              {deptWiseEvents.map((_, i) => (
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
    </div>
  );
};

export default Dashboard;
