


import { Geist, Geist_Mono } from "next/font/google";
import StyledComponentsRegistry from './registry';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ContextProvider } from "@/components/Context";
import GlobalSwalStyle from "@/styles/GlobalSwalStyle";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ECHOBYTE PAY",
  description: "ECHOBYTE PAY",
  applicationName: "YOUR SECURE PAYMENT SYSTEM",

  manifest: "/manifest.json",

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/logo.png",
  },

  appleWebApp: {
    capable: true,
    title: "ECHOBYTE PAY",
    statusBarStyle: "default",
  },

  themeColor: "#1d8f4d",
};

export default function RootLayout({ children }) {




  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StyledComponentsRegistry>

      
    
             <ContextProvider>
          {/* <Header /> */}
            <GlobalSwalStyle />
          {children}
         
          {/* <Footer /> */}
          </ContextProvider>
  
            </StyledComponentsRegistry>
        
      </body>
    </html>
  );
}
