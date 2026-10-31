import './globals.css';

export const metadata = {
  title: 'Vridhi | AI Growth & Outreach',
  description: 'AI-powered prospecting, outreach and sales growth workspace.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
