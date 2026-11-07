import './globals.css';

export const metadata = {
  title: 'Vridhi | People. Planet. Progress.',
  description: 'Vridhi is an environmental initiative rooted in Udaipur, Rajasthan, bringing people, knowledge and action together for a more sustainable future.',
  metadataBase: new URL('https://vridhi.ink'),
  openGraph: {
    title: 'Vridhi | People. Planet. Progress.',
    description: 'An environmental initiative rooted in Udaipur, Rajasthan.',
    url: 'https://vridhi.ink',
    siteName: 'Vridhi',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
