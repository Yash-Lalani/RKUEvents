import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend, ResponsiveContainer
} from "recharts";
import { ChartBarIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40 ${colorClass}`} />
    <div className="flex items-center justify-between mb-4 relative z-10">
      <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{title}</h2>
      <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${colorClass.replace('bg-', 'text-')}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <p className="text-4xl font-extrabold text-white relative z-10">{value}</p>
  </motion.div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  colorClass: PropTypes.string.isRequired,
};

const DepartmentAdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const department = user?.department;

  const [cards, setCards] = useState({ totalEvents: 0, registrations: 0 });
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [deptEvents, setDeptEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#14b8a6", "#3b82f6"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
        monthlyRes.data.map(item => ({ month: months[item._id - 1], count: item.count }))
      );
      setDeptEvents([{ name: department, value: cardsRes.data.totalEvents }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-2">
          {department} Dashboard
        </h1>
        <p className="text-gray-400">Manage and track events exclusively for your department.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <StatCard title="Department Events" value={cards.totalEvents} icon={ChartBarIcon} colorClass="bg-teal-500 text-teal-400" />
        <StatCard title="Total Registrations" value={cards.registrations} icon={CheckBadgeIcon} colorClass="bg-blue-500 text-blue-400" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart */}
        <div className="glass p-6 rounded-3xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Registration Trend</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#14b8a6" strokeWidth={4} dot={{fill: '#14b8a6', strokeWidth: 2, r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-2 w-full text-left">Your Events Share</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptEvents} dataKey="value" cx="50%" cy="50%" innerRadius="0%" outerRadius="80%" paddingAngle={5} stroke="none">
                  {deptEvents.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass p-6 rounded-3xl border border-white/10 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6">Monthly Growth Overview</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRegistrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
              <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAdminDashboard;
