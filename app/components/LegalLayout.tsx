export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
        {title}
      </h1>
      <div className="mt-8 space-y-6 text-slate-700">{children}</div>
    </main>
  );
}
