import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminAllBookings, updateBookingStatus, updateEstimatedCompletion } from "../api/bookings";
import { createService, deleteService, listAllServices, updateService } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { EmptyNote, ErrorText, Field, Panel, Row, StatusBadge } from "./CustomerDashboard";
import { COLORS, FONT_BODY, FONT_HEAD, GLOBAL_FONT_IMPORT, ghostBtn, inputStyle, outlineBtn, primaryBtn } from "../theme";

const emptyService = { name: "", description: "", price: "", estimated_duration_minutes: 60, is_active: true };

const ALLOWED_TRANSITIONS = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
}

function daysBetween(fromStr, toStr) {
  const from = new Date(fromStr);
  const to = new Date(toStr);
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
}

function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [serviceError, setServiceError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    refreshServices();
  }, []);

  useEffect(() => {
    refreshBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFilter, timeFilter]);

  async function refreshServices() {
    try {
      setServices(await listAllServices());
    } catch (err) {
      setServiceError(err.message);
    }
  }

  async function refreshBookings() {
    try {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (dateFilter) filters.scheduled_date = dateFilter;
      if (timeFilter) filters.scheduled_time = timeFilter;
      setBookings(await adminAllBookings(filters));
    } catch (err) {
      setBookingError(err.message);
    }
  }

  function startEdit(service) {
    setEditingId(service.id);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price,
      estimated_duration_minutes: service.estimated_duration_minutes,
      is_active: service.is_active,
    });
  }

  function resetForm() {
    setEditingId(null);
    setServiceForm(emptyService);
  }

  async function handleSubmitService(e) {
    e.preventDefault();
    setServiceError("");
    try {
      const payload = { ...serviceForm, price: Number(serviceForm.price) };
      if (editingId) {
        const updated = await updateService(editingId, payload);
        setServices((list) => list.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const created = await createService(payload);
        setServices((list) => [...list, created]);
      }
      resetForm();
    } catch (err) {
      setServiceError(err.message);
    }
  }

  async function handleToggleActive(service) {
    try {
      const updated = await updateService(service.id, { is_active: !service.is_active });
      setServices((list) => list.map((s) => (s.id === service.id ? updated : s)));
    } catch (err) {
      setServiceError(err.message);
    }
  }

  async function handleDeleteService(id) {
    try {
      await deleteService(id);
      setServices((list) => list.filter((s) => s.id !== id));
    } catch (err) {
      setServiceError(err.message);
    }
  }

  async function handleStatusChange(booking, newStatus) {
    setBookingError("");
    try {
      const updated = await updateBookingStatus(booking.id, newStatus);
      setBookings((list) => list.map((b) => (b.id === booking.id ? updated : b)));
    } catch (err) {
      setBookingError(err.message);
    }
  }

  async function handleEstimateChange(booking, newDate) {
    setBookingError("");
    try {
      const updated = await updateEstimatedCompletion(booking.id, newDate);
      setBookings((list) => list.map((b) => (b.id === booking.id ? updated : b)));
    } catch (err) {
      setBookingError(err.message);
    }
  }

  return (
    <div style={{ background: COLORS.asphalt, minHeight: "100vh", fontFamily: FONT_BODY }}>
      <style>{GLOBAL_FONT_IMPORT}</style>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
          borderBottom: `1px solid ${COLORS.hairline}`,
        }}
      >
        <Link to="/" style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 18, color: COLORS.chrome, textDecoration: "none" }}>
          Car Service Management
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: COLORS.muted, fontSize: 14 }}>{user?.email} · Admin</span>
          <button onClick={logout} style={ghostBtn}>
            Sign out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 30, color: COLORS.chrome, margin: "0 0 32px" }}>
          Admin panel
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, alignItems: "start" }}>
          {/* --- Service catalog --- */}
          <Panel title="Service catalog">
            {services.map((s) => (
              <div key={s.id} style={{ padding: "10px 0", borderBottom: `1px solid ${COLORS.hairline}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: COLORS.chrome, fontSize: 14 }}>
                      {s.name} — ₹{s.price}
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: 12 }}>{s.estimated_duration_minutes} min</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: s.is_active ? COLORS.success : COLORS.muted,
                        border: `1px solid ${s.is_active ? COLORS.success : COLORS.hairline}`,
                        borderRadius: 4,
                        padding: "2px 7px",
                      }}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                    <button onClick={() => handleToggleActive(s)} style={{ ...ghostBtn, padding: "5px 9px", fontSize: 12 }}>
                      {s.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => startEdit(s)} style={{ ...ghostBtn, padding: "5px 9px", fontSize: 12 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteService(s.id)} style={{ ...ghostBtn, padding: "5px 9px", fontSize: 12 }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <form onSubmit={handleSubmitService} style={{ marginTop: 18 }}>
              <div style={{ color: COLORS.chrome, fontSize: 13, marginBottom: 10 }}>
                {editingId ? "Edit service" : "Add a new service"}
              </div>
              <Row>
                <Field label="Name" value={serviceForm.name} onChange={(v) => setServiceForm({ ...serviceForm, name: v })} />
                <Field
                  label="Price (₹)"
                  type="number"
                  value={serviceForm.price}
                  onChange={(v) => setServiceForm({ ...serviceForm, price: v })}
                />
              </Row>
              <Row>
                <Field
                  label="Duration (min)"
                  type="number"
                  value={serviceForm.estimated_duration_minutes}
                  onChange={(v) => setServiceForm({ ...serviceForm, estimated_duration_minutes: v })}
                />
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 10, gap: 8 }}>
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={serviceForm.is_active}
                    onChange={(e) => setServiceForm({ ...serviceForm, is_active: e.target.checked })}
                  />
                  <label htmlFor="is_active" style={{ color: COLORS.muted, fontSize: 13 }}>
                    Active
                  </label>
                </div>
              </Row>
              <div style={{ marginBottom: 16 }}>
                <textarea
                  placeholder="Description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
              {serviceError && <ErrorText>{serviceError}</ErrorText>}
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" style={{ ...primaryBtn, flex: 1 }}>
                  {editingId ? "Save changes" : "Add service"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} style={{ ...outlineBtn }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </Panel>

          {/* --- All bookings --- */}
          <Panel title="Service requests">
            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ color: COLORS.muted, fontSize: 12 }}>Filter by status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                  <option value="">All</option>
                  {Object.keys(ALLOWED_TRANSITIONS).map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ color: COLORS.muted, fontSize: 12 }}>Filter by date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{ ...inputStyle, width: "auto", colorScheme: "dark" }}
                />
                {dateFilter && (
                  <button onClick={() => setDateFilter("")} style={{ ...ghostBtn, padding: "6px 10px", fontSize: 12 }}>
                    Clear
                  </button>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ color: COLORS.muted, fontSize: 12 }}>Filter by time</label>
                <input
                  type="time"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  style={{ ...inputStyle, width: "auto", colorScheme: "dark" }}
                />
                {timeFilter && (
                  <button onClick={() => setTimeFilter("")} style={{ ...ghostBtn, padding: "6px 10px", fontSize: 12 }}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {bookingError && <ErrorText>{bookingError}</ErrorText>}

            {bookings.length === 0 ? (
              <EmptyNote>No requests match this filter.</EmptyNote>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Customer", "Service", "Car", "Date", "Complete in", "Status", "Update"].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const nextOptions = ALLOWED_TRANSITIONS[b.status] || [];
                    return (
                      <tr key={b.id}>
                        <td style={tdStyle}>{b.customer_email}</td>
                        <td style={tdStyle}>{b.service_name}</td>
                        <td style={tdStyle}>{b.car_display}</td>
                        <td style={tdStyle}>
                          {b.scheduled_date} {formatTime12h(b.scheduled_time)}
                        </td>
                        <td style={tdStyle}>
                          <input
                            type="number"
                            min="0"
                            defaultValue={
                              b.estimated_completion_date
                                ? daysBetween(b.scheduled_date, b.estimated_completion_date)
                                : ""
                            }
                            onBlur={(e) => {
                              const days = e.target.value;
                              if (days === "") return;
                              const newDate = addDays(b.scheduled_date, days);
                              if (newDate !== b.estimated_completion_date) {
                                handleEstimateChange(b, newDate);
                              }
                            }}
                            placeholder="days"
                            style={{ ...inputStyle, width: 70, padding: "6px 8px", fontSize: 12 }}
                          />
                          <span style={{ color: COLORS.muted, fontSize: 11, marginLeft: 6 }}>days</span>
                        </td>
                        <td style={tdStyle}>
                          <StatusBadge status={b.status} />
                        </td>
                        <td style={tdStyle}>
                          {nextOptions.length > 0 ? (
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                if (!newStatus) return;

                                const isFinal = newStatus === "COMPLETED" || newStatus === "CANCELLED";
                                if (isFinal) {
                                  const ok = window.confirm(
                                    `Mark this as ${newStatus.replace("_", " ")}? This cannot be undone from here.`
                                  );
                                  if (!ok) {
                                    e.target.value = "";
                                    return;
                                  }
                                }

                                handleStatusChange(b, newStatus);
                                e.target.value = "";
                              }}
                              style={{ ...inputStyle, width: "auto", padding: "6px 8px", fontSize: 12 }}
                            >
                              <option value="" disabled>
                                Move to…
                              </option>
                              {nextOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt.replace("_", " ")}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span style={{ color: COLORS.muted, fontSize: 12 }}>Final</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Panel>
        </div>
      </main>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  color: COLORS.muted,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  padding: "8px 10px",
  borderBottom: `1px solid ${COLORS.hairline}`,
};

const tdStyle = {
  padding: "12px 10px",
  color: COLORS.chrome,
  fontSize: 14,
  borderBottom: `1px solid ${COLORS.hairline}`,
};