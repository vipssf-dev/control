import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
  semester?: string;
}

export function Layout({ children, semester }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col" dir="rtl">
      <nav className="border-b bg-background sticky top-0 z-10">
        <div className="w-full px-4 lg:px-8">
          <div className="flex gap-1 py-3">
            <Link
              href="/"
              data-testid="nav-semester1"
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                location === "/"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              الفصل الدراسي الأول
            </Link>
            <Link
              href="/semester2"
              data-testid="nav-semester2"
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                location === "/semester2"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              الفصل الدراسي الثاني
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <div className="w-full px-4 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
      <footer className="border-t bg-muted/30 py-4 px-4 text-center text-sm text-muted-foreground">
        © 1447 مدرسة الرياض الابتدائية تصميم وتطوير: صالح سفر الغامدي
      </footer>
    </div>
  );
}
