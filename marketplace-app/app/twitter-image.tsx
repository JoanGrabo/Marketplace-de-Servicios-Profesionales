import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: "linear-gradient(135deg, #ffffff 0%, #faf9f7 55%, #f5f4f1 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "18px" }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              background: "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 38,
              fontWeight: 900,
            }}
          >
            E
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 62, fontWeight: 900, letterSpacing: -1.8, color: "#1F2933" }}>Expert</span>
            <span style={{ fontSize: 62, fontWeight: 900, letterSpacing: -1.8, color: "#B8860B" }}>ysm</span>
          </div>
        </div>

        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2.0, color: "#4B5563" }}>
          Arquitectura y Legal
        </div>

        <div style={{ marginTop: "22px", maxWidth: 980, fontSize: 34, lineHeight: 1.25, color: "#1F2933" }}>
          Marketplace especializado para encontrar profesionales y contactar rápido.
        </div>
      </div>
    ),
    { ...size },
  );
}

