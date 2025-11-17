import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DepartmentEventDetailsList = () => {
  const [details, setDetails] = useState([]);

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const dept = user?.department || user?.dept || "";

  useEffect(() => {
    fetch("http://localhost:5000/api/event-details")
      .then((res) => res.json())
      .then((data) => {
        // If department admin → filter by their department
        if (user?.role === "department-admin") {
          const filtered = data.filter(
            (item) => item.department === dept
          );
          setDetails(filtered);
        } else {
          setDetails(data); // Super admin sees all
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {user?.role === "department-admin"
          ? `${dept} Department Event Details`
          : "Event Details"}
      </h2>

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
          {details.map((d) => (
            <tr key={d._id} className="border-b">
              <td className="p-2">{d.eventId?.name}</td>
              <td className="p-2">{d.department}</td>
              <td className="p-2">{d.dynamicFields.length}</td>
              <td className="p-2">
                <Link
                  to={`/department-admin/event-details-edit/${d._id}`}
                  className="text-blue-600 underline"
                >
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

export default DepartmentEventDetailsList;
