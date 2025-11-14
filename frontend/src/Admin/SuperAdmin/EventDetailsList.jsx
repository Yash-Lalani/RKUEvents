import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const EventDetailsList = () => {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/event-details")
      .then(res => res.json())
      .then(data => setDetails(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Event Details</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Event Name</th>
            <th className="p-2">Department</th>
            <th className="p-2">Fields</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {details.map(d => (
            <tr key={d._id} className="border-b">
              <td className="p-2">{d.eventId?.name}</td>
              <td className="p-2">{d.department}</td>
              <td className="p-2">{d.dynamicFields.length}</td>
              <td className="p-2">
                <Link to={`/super-admin/event-details-edit/${d._id}`} className="text-blue-600 underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default EventDetailsList;
