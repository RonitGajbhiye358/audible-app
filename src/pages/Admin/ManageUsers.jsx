import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../app/authSlice';
import api from '../../api/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/getAllUsers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  const deleteUser = async (customerId) => {
    try {
      await api.delete(`/admin/user/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user.customerId !== customerId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateUserRole = async (customerId, role) => {
    try {
      await api.put(`/admin/user/update-role/${customerId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { role }
      });
      setUsers(users.map(user => 
        user.customerId === customerId ? { ...user, role } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map(user => (
              <tr key={user.customerId} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{user.customerId}</td>
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.customerId, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => deleteUser(user.customerId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;