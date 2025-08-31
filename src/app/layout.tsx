
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import AppThemeProvider from '@/contexts/AppThemeContext';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./globals.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Newsletter Job Scheduler",
  description: "Design & schedule newsletter jobs easily",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <InitColorSchemeScript attribute="class" />

      <AppRouterCacheProvider>
        <AppThemeProvider>
        {children}
        </AppThemeProvider>
      </AppRouterCacheProvider>
      </body>
    </html>
  );
}
