import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Note-X",
  description: "NoteX - Google Keep inspired note-taking application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('note-x-theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] transition-colors duration-300 ease-in-out min-w-0">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}