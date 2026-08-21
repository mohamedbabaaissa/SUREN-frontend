import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

const STATUSES = ["All", "Processing", "Shipped", "Completed", "Cancelled"];

const statusToBackend = {
  Processing: "processing",
  Shipped: "shipped",
  Completed: "delivered",
  Cancelled: "cancelled",
};

const backendToUi = {
  pending: "Processing",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Completed",
  cancelled: "Cancelled",
};

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/orders/admin/all");
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Load admin orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, uiStatus) => {
    const backendStatus = statusToBackend[uiStatus];
    if (!backendStatus) return;

    try {
      const data = await apiFetch(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: backendStatus }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? data.order : order
        )
      );

      if (backendStatus === "cancelled") {
        alert("Order cancelled. Product stock has been restored.");
      }
    } catch (error) {
      alert(error.message || "Could not update order status.");
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Delete this order? Any stock reserved by this order will be restored."
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/orders/${orderId}`, {
        method: "DELETE",
      });

      setOrders((prev) =>
        prev.filter((order) => order._id !== orderId)
      );

      alert("Order deleted and stock restored.");
    } catch (error) {
      alert(error.message || "Could not delete order.");
    }
  };

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const uiStatus = backendToUi[order.status] || order.status;
        const matchesStatus =
          status === "All" || uiStatus === status;

        const q = query.trim().toLowerCase();

        const customer = [
          order.user?.name,
          order.user?.email,
          order.shipping?.email,
          order.shipping?.phone,
          order.shipping?.fullName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const id = order._id || "";

        return (
          matchesStatus &&
          (!q ||
            id.toLowerCase().includes(q) ||
            customer.includes(q))
        );
      }),
    [orders, query, status]
  );

  return (
    <>
      <div className="admin-page-header admin-page-header-row">
        <div>
          <h1>Order Management</h1>
          <p>
            Track orders, customer contact information, shipping details,
            stock, and fulfillment status.
          </p>
        </div>

        <div className="admin-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search order or customer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "18px",
          flexWrap: "wrap",
        }}
      >
        {STATUSES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            style={{
              padding: "7px 16px",
              fontSize: "12px",
              border: "1px solid #dedddc",
              background: status === item ? "#06447a" : "#fff",
              color: status === item ? "#fff" : "#30343a",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="admin-panel">
        {loading ? (
          <p className="admin-empty-state">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty-state">No orders to display.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer / Contact</th>
                  <th>Shipping Address</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((order) => {
                  const uiStatus =
                    backendToUi[order.status] || order.status;

                  const shipping = order.shipping || {};

                  const address = [
                    shipping.address,
                    shipping.city,
                    shipping.postalCode,
                    shipping.country,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr key={order._id}>
                      <td className="admin-row-link">
                        #{order._id.slice(-8)}
                      </td>

                      <td>
                        <div className="admin-contact-details">
                          <strong>
                            {shipping.fullName ||
                              order.user?.name ||
                              "—"}
                          </strong>

                          <span>
                            Email:{" "}
                            {shipping.email ||
                              order.user?.email ||
                              "—"}
                          </span>

                          <span>
                            Phone: {shipping.phone || "—"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-order-address">
                          {address || "—"}
                        </div>
                      </td>

                      <td>
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td>
                        {order.items?.reduce(
                          (sum, item) =>
                            sum + Number(item.quantity || 0),
                          0
                        ) || 0}
                      </td>

                      <td>
                        ${Number(order.total || 0).toFixed(2)}
                      </td>

                      <td>
                        <select
                          value={uiStatus}
                          onChange={(e) =>
                            updateStatus(
                              order._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Processing">
                            Processing
                          </option>
                          <option value="Shipped">
                            Shipped
                          </option>
                          <option value="Completed">
                            Completed
                          </option>
                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-order-delete"
                          onClick={() =>
                            deleteOrder(order._id)
                          }
                          aria-label={`Delete order ${order._id}`}
                          title="Delete order and restore stock"
                        >
                          <i className="fa-regular fa-trash-can" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#9a9da3",
                      }}
                    >
                      No orders match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderManagement;
