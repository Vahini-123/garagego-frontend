import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS, FONT_BODY, FONT_HEAD, GLOBAL_FONT_IMPORT } from "../theme";
import garageHero from "../assests/garage-hero.jpg";

// ---- Edit these to your real workshop details ----
const  CONTACT = {
  address: "BTM 2nd Stage, Bangalore, Karnataka",
  phone: "+91 93475 55940",
  email: "vennapusavahini@gmail.com",
  hours: "Mon – Sat, 9:00 AM – 6:00 PM",
};

const SERVICES = [
  { icon: "🛠️", name: "Periodic Service", text: "Oil and filter change with a multi-point inspection to keep your car running smoothly." },
  { icon: "🚿", name: "Car Wash & Detailing", text: "Thorough exterior wash and interior cleaning, inside and out." },
  { icon: "⚙️", name: "Wheel Alignment & Balancing", text: "A smoother ride and even tyre wear, recommended every 10,000 km." },
  { icon: "🔋", name: "Battery Check & Replacement", text: "Battery health check and replacement to avoid unexpected breakdowns." },
  { icon: "❄️", name: "AC Service & Gas Refill", text: "Cooling system check and gas top-up, especially before summer." },
  { icon: "🛑", name: "Brake Inspection & Pads", text: "Complete brake inspection and pad replacement for safe, responsive braking." },
  { icon: "🛞", name: "Tyre Replacement & Puncture", text: "Quick puncture repair or full tyre replacement with proper fitting." },
  { icon: "🔍", name: "General Inspection", text: "A full check of all major systems, ideal before a long trip or purchase." },
];

const STEPS = [
  { title: "Sign up & add your car", text: "Create a free account and save your car's details once." },
  { title: "Choose a service", text: "Pick the service, date and time that suit you." },
  { title: "Track the status", text: "Follow your request from Pending to Completed in your dashboard." },
  { title: "Get notified", text: "We email you every time the status changes, including when your car is ready." },
];

const FEATURES = ["Easy online booking", "Live status tracking", "Email updates"];

export default function Home() {
  const { isAuthed, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath = isAdmin ? "/admin" : "/dashboard";

  function handleSignOut() {
    logout();
    navigate("/");
  }

  return (
    <div style={{ background: COLORS.asphalt, minHeight: "100vh", fontFamily: FONT_BODY }}>
      <style>{`
        ${GLOBAL_FONT_IMPORT}
        html { scroll-behavior: smooth; }
        .csms-btn { transition: background 120ms ease, border-color 120ms ease, opacity 120ms ease; cursor: pointer; }
        .csms-btn:hover { opacity: 0.88; }
        .csms-card { transition: transform 160ms ease, border-color 160ms ease; }
        .csms-card:hover { transform: translateY(-4px); border-color: ${COLORS.steel}; }
        .csms-link { color: ${COLORS.muted}; text-decoration: none; transition: color 120ms ease; }
        .csms-link:hover { color: ${COLORS.chrome}; }
        .csms-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .csms-footer-grid { display: grid; grid-template-columns: 1.6fr 1fr 1.2fr 1.4fr; gap: 40px; }
        @media (max-width: 900px) {
          .csms-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .csms-footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .csms-grid-4, .csms-footer-grid { grid-template-columns: 1fr; }
          .csms-nav { padding: 14px 20px !important; }
          .csms-nav-links { display: none !important; }
          .csms-section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* ---------------- NAV ---------------- */}
      <nav
        className="csms-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
          background: `${COLORS.asphalt}ee`,
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${COLORS.hairline}`,
        }}
      ><span style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 22, letterSpacing: "0.5px", color: COLORS.chrome }}>
            Garage<span style={{ color: COLORS.signal }}>Go</span>
       </span>

        <div className="csms-nav-links" style={{ display: "flex", gap: 28, fontSize: 14 }}>
          <a href="#services" className="csms-link">Services</a>
          <a href="#how" className="csms-link">How it works</a>
          <a href="#contact" className="csms-link">Contact</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isAuthed ? (
            <>
              <Link to="/login" className="csms-btn" style={{ ...navGhostBtn, textDecoration: "none" }}>
                Sign in
              </Link>
              <Link to="/register" className="csms-btn" style={{ ...navOutlineBtn, textDecoration: "none" }}>
                Sign up
              </Link>
              <Link to="/admin/login" className="csms-btn" style={{ ...navAdminBtn, textDecoration: "none" }}>
                Admin login
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath} className="csms-btn" style={{ ...navOutlineBtn, textDecoration: "none" }}>
                {isAdmin ? "Admin panel" : "My dashboard"}
              </Link>
              <button className="csms-btn" onClick={handleSignOut} style={navSolidBtn}>
                Sign out
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ---------------- HERO ---------------- */}
      <section
        className="csms-section"
        style={{
          position: "relative",
          padding: "130px 40px 110px",
          textAlign: "center",
          overflow: "hidden",
          backgroundImage: `
            linear-gradient(180deg, rgba(15,16,18,0.86) 0%, rgba(15,16,18,0.72) 55%, ${COLORS.asphalt} 100%),
            url(${garageHero})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.signal}33 0%, transparent 70%)`,
          }}
        />

        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              fontSize: 12,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: COLORS.signal,
              border: `1px solid ${COLORS.signal}66`,
              borderRadius: 999,
              padding: "6px 16px",
              marginBottom: 24,
            }}
          >
            Book. Track. Drive.
          </div>
          <h1
            style={{
              fontFamily: FONT_HEAD,
              fontWeight: 700,
              fontSize: "clamp(32px, 5.5vw, 56px)",
              lineHeight: 1.12,
              color: COLORS.chrome,
              margin: "0 0 20px",
              letterSpacing: "0.3px",
            }}
          >
            Manage your vehicle service, start to finish.
          </h1>
          <p style={{ color: "#b8bcc2", fontSize: 17, lineHeight: 1.7, maxWidth: 580, margin: "0 auto 36px" }}>
            Register your vehicle, submit a service request, and track its status through completion.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {!isAuthed ? (
              <>
                <Link to="/register" className="csms-btn" style={{ ...heroPrimaryBtn, textDecoration: "none" }}>
                  Get started
                </Link>
                <Link to="/login" className="csms-btn" style={{ ...heroSecondaryBtn, textDecoration: "none" }}>
                  Sign in
                </Link>
              </>
            ) : (
              <Link to={dashboardPath} className="csms-btn" style={{ ...heroPrimaryBtn, textDecoration: "none" }}>
                {isAdmin ? "Go to admin panel" : "Go to my dashboard"}
              </Link>
            )}
          </div>

          <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap", marginTop: 44 }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ color: COLORS.chrome, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: COLORS.signal, fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section id="services" className="csms-section" style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 40px 40px" }}>
        <SectionHeading
          eyebrow="What we do"
          title="Services for every need"
          copy="From routine maintenance to quick fixes, book the right service for your car in a few clicks."
        />
        <div className="csms-grid-4">
          {SERVICES.map((s) => (
            <div
              key={s.name}
              className="csms-card"
              style={{ background: COLORS.graphite, border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "26px 24px" }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: `${COLORS.signal}1f`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 16,
                }}
              >
                {s.icon}
              </div>
              <h3 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 18, color: COLORS.chrome, margin: "0 0 8px" }}>{s.name}</h3>
              <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section
        id="how"
        style={{
          marginTop: 70,
          background: COLORS.graphite,
          borderTop: `1px solid ${COLORS.hairline}`,
          borderBottom: `1px solid ${COLORS.hairline}`,
        }}
      >
        <div className="csms-section" style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 40px" }}>
          <SectionHeading
            eyebrow="Simple process"
            title="How it works"
            copy="Four easy steps from booking to pickup."
          />
          <div className="csms-grid-4">
            {STEPS.map((s, i) => (
              <div key={s.title} style={{ textAlign: "center", padding: "0 8px" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    margin: "0 auto 18px",
                    borderRadius: "50%",
                    border: `1px solid ${COLORS.signal}`,
                    color: COLORS.signal,
                    fontFamily: FONT_HEAD,
                    fontWeight: 600,
                    fontSize: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 18, color: COLORS.chrome, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA BANNER ---------------- */}
      <section className="csms-section" style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 40px" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            borderRadius: 14,
            border: `1px solid ${COLORS.hairline}`,
            padding: "56px 32px",
            background: `linear-gradient(135deg, ${COLORS.graphite} 0%, #2a2d32 100%)`,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -90,
              left: -90,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.signal}2e 0%, transparent 70%)`,
            }}
          />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 32, color: COLORS.chrome, margin: "0 0 12px" }}>
              Ready to book your service?
            </h2>
            <p style={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 28px" }}>
              Add your cars, request service, and track status from open to complete.
            </p>
            {!isAuthed ? (
              <Link to="/register" className="csms-btn" style={{ ...heroPrimaryBtn, textDecoration: "none", display: "inline-block" }}>
                Sign up as customer
              </Link>
            ) : (
              <Link to={dashboardPath} className="csms-btn" style={{ ...heroPrimaryBtn, textDecoration: "none", display: "inline-block" }}>
                {isAdmin ? "Go to admin panel" : "Go to my dashboard"}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer id="contact" style={{ background: "#141517", borderTop: `1px solid ${COLORS.hairline}` }}>
        <div className="csms-section" style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 40px 40px" }}>
          <div className="csms-footer-grid">
            <div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 22, color: COLORS.chrome, marginBottom: 14 }}>
  Garage<span style={{ color: COLORS.signal }}>Go</span>
</div>
              <p style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.7, margin: 0, maxWidth: 300 }}>
                Book, track and manage your vehicle service online. Honest work, clear updates, and your car back on the road.
              </p>
            </div>

            <div>
              <FooterHeading>Quick links</FooterHeading>
              <FooterList>
                <a href="#services" className="csms-link">Services</a>
                <a href="#how" className="csms-link">How it works</a>
                {!isAuthed ? (
                  <>
                    <Link to="/login" className="csms-link">Sign in</Link>
                    <Link to="/register" className="csms-link">Sign up</Link>
                  </>
                ) : (
                  <Link to={dashboardPath} className="csms-link">{isAdmin ? "Admin panel" : "My dashboard"}</Link>
                )}
              </FooterList>
            </div>

            <div>
              <FooterHeading>Popular services</FooterHeading>
              <FooterList>
                <span style={footerText}>Periodic Service</span>
                <span style={footerText}>Car Wash & Detailing</span>
                <span style={footerText}>Brake Inspection</span>
                <span style={footerText}>AC Service</span>
              </FooterList>
            </div>

            <div>
              <FooterHeading>Contact us</FooterHeading>
              <FooterList>
                <span style={footerText}>📍 {CONTACT.address}</span>
                <span style={footerText}>📞 {CONTACT.phone}</span>
                <span style={footerText}>✉️ {CONTACT.email}</span>
                <span style={footerText}>🕒 {CONTACT.hours}</span>
              </FooterList>
            </div>
          </div>

          <div
            style={{
              marginTop: 48,
              paddingTop: 22,
              borderTop: `1px solid ${COLORS.hairline}`,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
              color: COLORS.muted,
              fontSize: 13,
            }}
          >
            <span>© {new Date().getFullYear()} GarageGo. All rights reserved.</span>
            <span>Made for smooth, stress-free car care.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 44px" }}>
      <div style={{ fontSize: 12, letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.signal, marginBottom: 10 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 34, color: COLORS.chrome, margin: "0 0 12px" }}>{title}</h2>
      <p style={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.7, margin: 0 }}>{copy}</p>
    </div>
  );
}

function FooterHeading({ children }) {
  return (
    <div
      style={{
        fontFamily: FONT_HEAD,
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        color: COLORS.chrome,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

function FooterList({ children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14 }}>{children}</div>;
}

const footerText = { color: COLORS.muted, lineHeight: 1.5 };

const baseNavBtn = {
  fontFamily: FONT_BODY,
  fontWeight: 500,
  fontSize: 14,
  padding: "9px 16px",
  borderRadius: 6,
  border: "1px solid transparent",
};

const navGhostBtn = { ...baseNavBtn, background: "transparent", color: COLORS.chrome, border: `1px solid ${COLORS.hairline}` };
const navOutlineBtn = { ...baseNavBtn, background: "transparent", color: COLORS.steel, border: `1px solid ${COLORS.steel}` };
const navAdminBtn = { ...baseNavBtn, background: "transparent", color: COLORS.muted, border: `1px solid ${COLORS.hairline}` };
const navSolidBtn = { ...baseNavBtn, background: COLORS.signal, color: COLORS.chrome, border: `1px solid ${COLORS.signal}` };

const heroPrimaryBtn = {
  fontFamily: FONT_BODY,
  fontWeight: 500,
  fontSize: 15,
  padding: "14px 30px",
  borderRadius: 6,
  background: COLORS.signal,
  color: COLORS.chrome,
  border: `1px solid ${COLORS.signal}`,
};

const heroSecondaryBtn = {
  fontFamily: FONT_BODY,
  fontWeight: 500,
  fontSize: 15,
  padding: "14px 30px",
  borderRadius: 6,
  background: "transparent",
  color: COLORS.chrome,
  border: `1px solid ${COLORS.chrome}66`,
};