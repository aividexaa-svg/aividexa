export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0B0E14]">
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-8">
          {title}
        </h1>

        <div className="prose prose-invert max-w-none text-white/80">
          {children}
        </div>
      </section>
    </main>
  );
}
