
const bespokeStats   = { activeProjects: "—", fittingsThisWeek: "—", pendingRequests: "—" };
const appointments   = [];

function BespokeManagement() {
  return (
    <> 
      <div className="admin-page-header">

        COMING SOON
        
        {/*
        <h1>Concierge</h1>
        <p>
          Manage private fittings and bespoke tailoring appointments across
          all boutiques.
        </p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card dark">
          <div className="admin-stat-label">Active Projects</div>
          <div className="admin-stat-value">{bespokeStats.activeProjects}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Fittings This Week</div>
          <div className="admin-stat-value">{bespokeStats.fittingsThisWeek}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Pending Requests</div>
          <div className="admin-stat-value">{bespokeStats.pendingRequests}</div>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Upcoming Appointments</h2>

        {appointments.length === 0 ? (
          <p className="admin-empty-state">
            No appointments to display. Connect your scheduling API to populate this table.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((ap) => (
                <tr key={ap.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={ap.avatar}
                        alt={ap.client}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      {ap.client}
                    </div>
                  </td>
                  <td>{ap.type}</td>
                  <td>{ap.location}</td>
                  <td>{ap.date}</td>
                  <td>
                    <span className={`status-badge status-${ap.status}`}>{ap.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )} */}
      </div>
    </>
  );
}

export default BespokeManagement; 
 