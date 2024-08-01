import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import QueryProvider from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConnecttoWorld",
  description: "Discord clone",
  icons: "https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-o5mluhz2.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider >
        <html lang="en" suppressHydrationWarning>
          <body className={cn(inter.className,
            "bg-white dark:bg-[#313338]")
          }>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
                <QueryProvider>
                  { children}
                </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
  
  );
}
