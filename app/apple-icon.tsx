import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0A08",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "84%",
            height: "84%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "3px solid #B08D57",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 72,
              color: "#B08D57",
            }}
          >
            BE
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
