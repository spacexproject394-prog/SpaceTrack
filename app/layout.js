import "./globals.css";

export const metadata = {
  title: "SpaceTrack — Keeping every pet safe",
  description:
    "Live pet tracking platform founded by Vanessa Zamzow, dedicated to keeping every animal safe",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#5E2A52",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}