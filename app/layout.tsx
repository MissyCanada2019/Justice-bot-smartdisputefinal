import './globals.css';

export const metadata = {
  title: 'JusticeBot.AI',
  description: 'Your Partner in Canadian Law',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
