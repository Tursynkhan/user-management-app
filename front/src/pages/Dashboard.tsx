import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  last_login: string;
}
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setUsers(res.data as User[]))
    .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      <h2>User Management</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>{user.last_login}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
