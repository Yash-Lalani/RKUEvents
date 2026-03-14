import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const EventDetailsList = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/event-details")
      .then(res => res.json())
      .then(data => {
        setDetails(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pb-10 min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Event Specifications</h1>
        <p className="text-gray-400">Manage dynamic registration schemas and configurations.</p>
      </div>

      <div className="glass rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : details.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No event specifications configured yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Event Target</th>
                  <th className="px-6 py-4 font-semibold">Department Filter</th>
                  <th className="px-6 py-4 font-semibold">Custom Fields</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {details
                  .filter(d => d.eventId) // remove rows with missing event
                  .map((d) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      key={d._id} 
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{d.eventId.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-bold tracking-wider uppercase">
                          {d.department}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-400 font-mono font-medium">
                          {d.dynamicFields.length} fields
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-end">
                        <Link 
                          to={`/super-admin/event-details-edit/${d._id}`} 
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl transition-all"
                        >
                          <PencilSquareIcon className="w-4 h-4" /> Edit Schema
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsList;
