import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import orderApi from '../../api/orderApi';
import TrackingOrder from "../../components/comon/TrackingOrder";
import { formatCurrency } from '../../utils/formatCurrency';
import "../../styles/admin/OrderManagement.css";


const levelColors = {
  Processing: "#f59e0b",
  Shipping: "#3b82f6",
  "Delivered successfully": "#10b981",
  Cancel: "#ef4444",
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await orderApi.orders();
        setOrders(response.orders);
      } catch (err) {
        toast.error(err.response?.data?.messgae || err.message);
      }
    }
    getOrders();
  }, []);

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.level === filter);

  const handleOrder = (order) => {
    setOpen(true);
    setOrder(order);

  }
  return (
    <>
      <div className="order-page">
        <div className="order-header">
          <h2>📦 Order Management</h2>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="Processing">Processing</option>
            <option value="Shipping">Shipping</option>
            <option value="Delivered successfully">Delivered successfully</option>
            <option value="Cancel">Cancel</option>
          </select>
        </div>

        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <motion.div
              key="empty"
              className="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>Không có đơn hàng nào.</p>
            </motion.div>
          ) : (
            <motion.table
              key="table"
              className="order-table"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Detail</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order , index) => (
                  <motion.tr
                    key={order._id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <td className="index">{index+1}</td>
                    <td>
                      <div className="customer-info">
                        <strong>{order.name}</strong>
                        <span>{order.phone}</span>
                      </div>
                    </td>
                    <td>{order.address}</td>
                    <td>
                      {formatCurrency(order.final_amount, 'en-US', 'USD')}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{ backgroundColor: levelColors[order.status] }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${order.status === "paid" ? "paid" : "unpaid"
                          }`}
                      >
                        {order.payment}
                      </span>
                    </td>
                    <td>
                      <motion.button
                        className="detail-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }} onClick={() => handleOrder(order)}
                      >
                        Chi tiết
                      </motion.button>
                    </td>
                    <td>
                      <motion.button
                        className="action-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }} onClick={() => handleOrder(order)}
                      >
                        Update
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          )}
        </AnimatePresence>

      </div>
      {open &&
        (
          <div className='modal-overlay' onClick={()=>setOpen(false)}>
            <div className='modal-content' style={{overflow:'scroll'}} onClick={(e)=>e.stopPropagation()}>
              <TrackingOrder order={order} />
            </div>
          </div>
        )}
    </>
  );
};

