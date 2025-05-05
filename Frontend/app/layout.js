import localFont from "next/font/local";
import { UserProvider } from "../context/UserContext";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "BudgetChain",
  description: "Branched Blockchain Transaction Service",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto`}
      >
        {children}
      </body>
    </html>
    </UserProvider>
  );
}
