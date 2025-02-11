import { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import { Sparklines, SparklinesBars } from "react-sparklines";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: string | null;
  status: "active" | "blocked";
  activityData: number[];
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get<User[]>(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleAction = async (action: "block" | "unblock" | "delete") => {
    if (selectedUsers.length === 0) return;

    try {
      await axios.post(
        `${API_URL}/users/action`,
        { ids: selectedUsers, action },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Action error:", error);
    }
  };

  const formatLastSeen = (date: string | null) => {
    if (!date) return "N/A";
    const diff = (new Date().getTime() - new Date(date).getTime()) / 1000 / 60;
    if (diff < 1) return "less than a minute ago";
    if (diff < 60) return `${Math.floor(diff)} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    if (diff < 10080) return `${Math.floor(diff / 1440)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="container mt-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button onClick={() => handleAction("block")} className="bg-blue-500 text-white px-3 py-2 rounded mr-2">
            🔒 Block
          </button>
          <button onClick={() => handleAction("unblock")} className="bg-blue-500 text-white px-3 py-2 rounded mr-2">
            🔓 Unblock
          </button>
          <button onClick={() => handleAction("delete")} className="bg-red-500 text-white px-3 py-2 rounded">
            🗑 Delete
          </button>
        </div>
        <input
          type="text"
          placeholder="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedUsers(e.target.checked ? users.map((user) => user.id) : [])
                }
                checked={selectedUsers.length === users.length && users.length > 0}
              />
            </th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.name.toLowerCase().includes(filter.toLowerCase()))
            .map((user) => (
              <tr key={user.id} className={user.status === "blocked" ? "opacity-50" : ""}>
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelection(user.id)}
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <span className={user.status === "blocked" ? "line-through text-gray-500" : ""}>
                    {user.name}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">
                  <span data-tooltip-id={`tooltip-${user.id}`} data-tooltip-content={new Date(user.lastLogin || "").toLocaleString()}>
                    {formatLastSeen(user.lastLogin)}
                  </span>
                  <Tooltip id={`tooltip-${user.id}`} />
                  <Sparklines data={user.activityData} width={50} height={20}>
                    <SparklinesBars style={{ fill: "#3498db" }} />
                  </Sparklines>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
