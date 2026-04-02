import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
          background: "linear-gradient(135deg, #ffffff 0%, #faf9f7 55%, #f5f4f1 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "22px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 40,
              fontWeight: 900,
            }}
          >
            E
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
            <span style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1.8, color: "#1F2933" }}>Expert</span>
            <span style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1.8, color: "#B8860B" }}>ysm</span>
          </div>
        </div>

        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2.2, color: "#4B5563" }}>
          Arquitectura y Legal
        </div>

        <div style={{ marginTop: "26px", maxWidth: 920, fontSize: 34, lineHeight: 1.25, color: "#1F2933" }}>
          Contrata servicios profesionales con claridad: arquitectos y abogados en un solo lugar.
        </div>

        <div style={{ marginTop: "26px", fontSize: 22, color: "#6B7280" }}>
          expertysm.com
        </div>
      </div>
    ),
    { ...size },
  );
}

