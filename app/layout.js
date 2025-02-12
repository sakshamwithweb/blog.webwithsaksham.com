import Navbar from "@/components/Navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/Footer";
import ConsoleMessage from "../components/ConsoleMessage";

export const metadata = {
  title: "Blog - Saksham Goswami",
  description: "Saksham's Message",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-p-20 scroll-smooth">
      <body>
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem>
          <Navbar />
          <ConsoleMessage>
            {children}
          </ConsoleMessage>
          <Footer/>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
