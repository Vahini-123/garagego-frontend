import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createBooking, myBookings } from "../api/bookings";
import { createCar, deleteCar, listCars } from "../api/cars";
import { listActiveServices } from "../api/services";
import { useAuth } from "../context/AuthContext";
import {
  COLORS,
  FONT_BODY,
  FONT_HEAD,
  GLOBAL_FONT_IMPORT,
  ghostBtn,
  inputStyle,
  labelStyle,
  outlineBtn,
  primaryBtn,
  statusColor,
} from "../theme";

const emptyCar = { make: "", model: "", year: "", registration_number: "" };
const emptyBooking = { car: "", service_type: "", scheduled_date: "", scheduled_time: "", notes: "" };

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatTime12h(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [carForm, setCarForm] = useState(emptyCar);
  const [bookingForm, setBookingForm] = useState(emptyBooking);

  const [carError, setCarError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshAll();
  }, []);

  async function refreshAll() {
    setLoading(true);
    try {
      const [carsData, servicesData, bookingsData] = await Promise.all([
        listCars(),
        listActiveServices(),
        myBookings(),
      ]);
      setCars(carsData);
      setServices(servicesData);
      setBookings(bookingsData);
    } catch {
      // Individual sections show their own empty states; nothing else to do here.
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCar(e) {
    e.preventDefault();
    setCarError("");
    try {
      const car = await createCar({ ...carForm, year: Number(carForm.year) });
      setCars((c) => [car, ...c]);
      setCarForm(emptyCar);
    } catch (err) {
      setCarError(err.message);
    }
  }

  async function handleDeleteCar(id) {
    try {
      await deleteCar(id);
      setCars((c) => c.filter((car) => car.id !== id));
    } catch (err) {
      setCarError(err.message);
    }
  }

  async function handleBook(e) {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");
    try {
      const created = await createBooking({
        ...bookingForm,
        car: Number(bookingForm.car),
        service_type: Number(bookingForm.service_type),
      });
      setBookings((b) => [created, ...b]);
      setBookingForm(emptyBooking);
      setBookingSuccess("Service booked.");
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
          GarageGo
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: COLORS.muted, fontSize: 14 }}>{user?.email}</span>
          <button
            onClick={logout}
            style={{ ...ghostBtn }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px" }}>
        <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 30, color: COLORS.chrome, margin: "0 0 32px" }}>
          My dashboard
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, alignItems: "start" }}>
          {/* --- My cars --- */}
          <Panel title="My cars">
            {cars.length === 0 && !loading && (
              <EmptyNote>No cars yet — add one below to book a service.</EmptyNote>
            )}
            {cars.map((car) => (
              <div
                key={car.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: `1px solid ${COLORS.hairline}`,
                }}
              >
                <div>
                  <div style={{ color: COLORS.chrome, fontSize: 14 }}>
                    {car.make} {car.model} ({car.year})
                  </div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>{car.registration_number}</div>
                </div>
                <button onClick={() => handleDeleteCar(car.id)} style={{ ...ghostBtn, padding: "6px 10px", fontSize: 12 }}>
                  Remove
                </button>
              </div>
            ))}

            <form onSubmit={handleAddCar} style={{ marginTop: 18 }}>
              <Row>
                <Field label="Name" value={carForm.make} onChange={(v) => setCarForm({ ...carForm, make: v })} />
                <Field label="Model" value={carForm.model} onChange={(v) => setCarForm({ ...carForm, model: v })} />
              </Row>
              <Row>
                <Field label="Year" type="number" value={carForm.year} onChange={(v) => setCarForm({ ...carForm, year: v })} />
                <Field
                  label="Registration no."
                  value={carForm.registration_number}
                  onChange={(v) => setCarForm({ ...carForm, registration_number: v })}
                />
              </Row>
              {carError && <ErrorText>{carError}</ErrorText>}
              <button type="submit" style={{ ...outlineBtn, width: "100%", marginTop: 4 }}>
                Add car
              </button>
            </form>
          </Panel>

          {/* --- Book a service --- */}
          <Panel title="Book a service">
            {cars.length === 0 ? (
              <EmptyNote>Add a car first, then you can book a service for it.</EmptyNote>
            ) : (
              <form onSubmit={handleBook}>
                <Row>
                  <SelectField
                    label="Car"
                    value={bookingForm.car}
                    onChange={(v) => setBookingForm({ ...bookingForm, car: v })}
                    options={cars.map((c) => ({ value: c.id, label: `${c.make} ${c.model} (${c.registration_number})` }))}
                  />
                  <SelectField
                    label="Service"
                    value={bookingForm.service_type}
                    onChange={(v) => setBookingForm({ ...bookingForm, service_type: v })}
                    options={services.map((s) => ({ value: s.id, label: `${s.name} — ₹${s.price}` }))}
                  />
                </Row>
                <Row>
                  <Field
                    label="Date"
                    type="date"
                    min={todayStr()}
                    value={bookingForm.scheduled_date}
                    onChange={(v) => setBookingForm({ ...bookingForm, scheduled_date: v })}
                  />
                  <Field
                    label="Time"
                    type="time"
                    value={bookingForm.scheduled_time}
                    onChange={(v) => setBookingForm({ ...bookingForm, scheduled_time: v })}
                  />
                </Row>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Notes (optional)</label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
                {bookingError && <ErrorText>{bookingError}</ErrorText>}
                {bookingSuccess && <div style={{ color: COLORS.success, fontSize: 13, marginBottom: 14 }}>{bookingSuccess}</div>}
                <button type="submit" style={{ ...primaryBtn, width: "100%" }}>
                  Book service
                </button>
              </form>
            )}
          </Panel>
        </div>

        {/* --- My requests --- */}
        <div style={{ marginTop: 32 }}>
          <Panel title="My service requests">
            {bookings.length === 0 && !loading ? (
              <EmptyNote>No requests yet — book a service above and it'll show up here.</EmptyNote>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Service", "Car", "Date", "Time", "Est. completion", "Status"].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td style={tdStyle}>{b.service_name}</td>
                      <td style={tdStyle}>{b.car_display}</td>
                      <td style={tdStyle}>{b.scheduled_date}</td>
                      <td style={tdStyle}>{formatTime12h(b.scheduled_time)}</td>
                      <td style={tdStyle}>{b.estimated_completion_date || "—"}</td>
                      <td style={tdStyle}>
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </div>
      </main>
    </div>
  );
}

// ---------------- shared small components ----------------

export function Panel({ title, children }) {
  return (
    <div style={{ background: COLORS.graphite, border: `1px solid ${COLORS.hairline}`, borderRadius: 8, padding: "24px 26px" }}>
      <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 18, color: COLORS.chrome, margin: "0 0 16px" }}>{title}</h2>
      {children}
    </div>
  );
}

export function Row({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>{children}</div>;
}

export function Field({ label, type = "text", value, onChange, required = true, ...rest }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} required={required} onChange={(e) => onChange(e.target.value)} style={inputStyle} {...rest} />
    </div>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <select value={value} required onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ErrorText({ children }) {
  return <div style={{ color: COLORS.danger, fontSize: 13, marginBottom: 14 }}>{children}</div>;
}

export function EmptyNote({ children }) {
  return <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6 }}>{children}</p>;
}

export function StatusBadge({ status }) {
  const color = statusColor(status);
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 12,
        fontWeight: 500,
        color,
        border: `1px solid ${color}`,
        borderRadius: 4,
        padding: "3px 9px",
        letterSpacing: "0.3px",
      }}
    >
      {status.replace("_", " ")}
    </span>
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