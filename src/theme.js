// Shared design tokens, lifted from Home.jsx so every page stays visually consistent.

export const COLORS = {
  asphalt: "#1B1D1F",
  graphite: "#26292D",
  chrome: "#E9EBEC",
  steel: "#5B85A6",
  signal: "#E85C2B",
  muted: "#8B9096",
  hairline: "#3A3D42",
  danger: "#D64545",
  success: "#4C9A6A",
};

export const FONT_HEAD = "'Oswald', sans-serif";
export const FONT_BODY = "'IBM Plex Sans', sans-serif";

export const GLOBAL_FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');";

export const inputStyle = {
  fontFamily: FONT_BODY,
  fontSize: 14,
  color: COLORS.chrome,
  background: COLORS.asphalt,
  border: `1px solid ${COLORS.hairline}`,
  borderRadius: 6,
  padding: "10px 12px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

export const labelStyle = {
  fontFamily: FONT_BODY,
  fontSize: 12,
  letterSpacing: "0.4px",
  color: COLORS.muted,
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
};

export const primaryBtn = {
  fontFamily: FONT_BODY,
  fontWeight: 500,
  fontSize: 14,
  padding: "11px 20px",
  borderRadius: 6,
  background: COLORS.signal,
  color: COLORS.chrome,
  border: `1px solid ${COLORS.signal}`,
  cursor: "pointer",
};

export const outlineBtn = {
  fontFamily: FONT_BODY,
  fontWeight: 500,
  fontSize: 14,
  padding: "11px 20px",
  borderRadius: 6,
  background: "transparent",
  color: COLORS.steel,
  border: `1px solid ${COLORS.steel}`,
  cursor: "pointer",
};

export const ghostBtn = {
  fontFamily: FONT_BODY,
  fontWeight: 500,
  fontSize: 13,
  padding: "8px 14px",
  borderRadius: 6,
  background: "transparent",
  color: COLORS.muted,
  border: `1px solid ${COLORS.hairline}`,
  cursor: "pointer",
};

export function statusColor(status) {
  switch (status) {
    case "PENDING":
      return COLORS.muted;
    case "CONFIRMED":
      return COLORS.steel;
    case "IN_PROGRESS":
      return COLORS.signal;
    case "COMPLETED":
      return COLORS.success;
    case "CANCELLED":
      return COLORS.danger;
    default:
      return COLORS.muted;
  }
}
