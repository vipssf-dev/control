export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col" dir="rtl">
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
