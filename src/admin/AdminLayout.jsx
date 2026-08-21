import { NavLink, Outlet, Link, Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import "./Admin.css";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: "fa-gauge", end: true },
  { to: "/admin/orders", label: "Order Management", icon: "fa-bag-shopping" },
  { to: "/admin/bespoke", label: "Bespoke Management", icon: "fa-scissors" },
  { to: "/admin/customers", label: "Customer Relations", icon: "fa-users" },
];

function AdminLayout() {
  const { user, authLoading } = useStore();
  if (authLoading) return <div className="route-loader">Checking access...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link to="/" className="admin-logo"><span>SUREN</span><small>Admin</small></Link>
      <nav className="admin-nav">{NAV_ITEMS.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({isActive}) => `admin-nav-link${isActive ? " active" : ""}`}><i className={`fa-solid ${item.icon}`} /><span>{item.label}</span></NavLink>)}</nav>
      <Link to="/" className="admin-back-link"><i className="fa-solid fa-arrow-left" /><span>Back to Store</span></Link>
    </aside>
    <main className="admin-main"><Outlet /></main>
  </div>;
}
export default AdminLayout;
