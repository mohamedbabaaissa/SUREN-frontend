import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/auth/users")
      .then((data) => setCustomers(data.users || []))
      .catch((error) => console.error("Load customers error:", error))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [customers, query]);

  const selected =
    customers.find((c) => c._id === selectedId) || filtered[0] || null;

  if (loading)
    return (
      <div className="admin-panel">
        <p className="admin-empty-state">Loading customers...</p>
      </div>
    );

  return (
    <>
      <div className="admin-page-header admin-page-header-row">
        <div>
          <h1>Customer Relations</h1>
          <p>Manage the SUREN customer database.</p>
        </div>
        <div className="admin-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      {customers.length === 0 ? (
        <div className="admin-panel">
          <p className="admin-empty-state">No customers to display.</p>
        </div>
      ) : (
        <div className="customer-layout">
          <div className="admin-panel">
            <div className="customer-list">
              {filtered.map((c) => (
                <button
                  key={c._id}
                  className={`customer-row${selected?._id === c._id ? " selected" : ""}`}
                  onClick={() => setSelectedId(c._id)}
                >
                  <div className="customer-row-info">
                    <div className="customer-row-name">{c.name}</div>
                    <div className="customer-row-email">{c.email}</div>
                  </div>
                  <span className={`customer-tier ${c.role}`}>{c.role}</span>
                </button>
              ))}
            </div>
          </div>
          {selected && (
            <div className="customer-detail">
              <div className="customer-detail-header">
                <h3>{selected.name}</h3>
                <p>{selected.email}</p>
                <p>
                  Joined {new Date(selected.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="customer-detail-stats">
                <div className="customer-detail-stat">
                  <strong>{selected.role}</strong>
                  <span>Role</span>
                </div>
                <div className="customer-detail-stat">
                  <strong>
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </strong>
                  <span>Joined</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
export default CustomerManagement;
