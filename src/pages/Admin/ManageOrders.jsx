import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../app/authSlice';
import api from '../../api/api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState({});
  const [audiobooks, setAudiobooks] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState({});
  const token = useSelector(selectCurrentToken);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch orders (completed)
        const ordersResponse = await api.get('/admin/orders/get-all');

        // Fetch carts (pending)
        const cartsResponse = await api.get('/admin/all/bookcarts');

        // Combine all user IDs from both orders and carts
        const allUserIds = [
          ...new Set([
            ...ordersResponse.data.map(order => order.userId),
            ...cartsResponse.data.map(cart => cart.userId)
          ])
        ];

        // Fetch user details
        const usersData = {};
        await Promise.all(
          allUserIds.map(async userId => {
            const response = await api.get(`/admin/user/getByUserId/${userId}`);
            usersData[userId] = response.data;
          })
        );

        // Fetch audiobook details
        const allAudiobookIds = [
          ...new Set([
            ...ordersResponse.data.flatMap(order => order.audiobookIds),
            ...cartsResponse.data.flatMap(cart => cart.audiobookIds)
          ])
        ];

        const audiobookDetails = {};
        await Promise.all(
          allAudiobookIds.map(async id => {
            const response = await api.get(`/audiobooks/${id}`);
            audiobookDetails[id] = response.data;
          })
        );

        setOrders(ordersResponse.data);
        setCarts(cartsResponse.data);
        setUsers(usersData);
        setAudiobooks(audiobookDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, statusUpdates]);

  // Filter carts to only show those with "inCart" status
  const filteredCarts = carts.filter(cart => {
    const cartStatus = statusUpdates[cart.cartId] || 'inCart';
    return cartStatus === 'inCart' && cart.audiobookIds.length > 0;
  });

  // Calculate total price
  const calculateTotal = (audiobookIds) => {
    return audiobookIds.reduce((total, id) => total + (audiobooks[id]?.price || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders & Carts</h1>
      
      {/* Orders Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Completed Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Books</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.map(order => (
                <tr key={`order-${order.orderId || order.userId}`} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{order.userId}</td>
                  <td className="py-3 px-4">
                    {users[order.userId] ? `${users[order.userId].name}` : 'Loading...'}
                  </td>
                  <td className="py-3 px-4">
                    {order.audiobookIds.map(id => (
                      <div key={id} className="mb-1">
                        {audiobooks[id] ? (
                          <>
                            <span className="font-medium">{audiobooks[id].title}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              ${audiobooks[id].price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400">Loading book #{id}...</span>
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4">
                    ${calculateTotal(order.audiobookIds).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Carts Section - Only show if there are carts with books */}
      {filteredCarts.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Carts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Books</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredCarts.map(cart => (
                  <tr key={`cart-${cart.bookCartId}`} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{cart.userId}</td>
                    <td className="py-3 px-4">
                      {users[cart.userId] ? `${users[cart.userId].name}` : 'Loading...'}
                    </td>
                    <td className="py-3 px-4">
                      {cart.audiobookIds.map(id => (
                        <div key={id} className="mb-1">
                          {audiobooks[id] ? (
                            <>
                              <span className="font-medium">{audiobooks[id].title}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                ${audiobooks[id].price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400">Loading book #{id}...</span>
                          )}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4">
                      ${calculateTotal(cart.audiobookIds).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-blue-600 font-medium">In Cart</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">No active carts with books at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;