export default function StubPage({ title, note }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-condensed text-sm tracking-[0.18em] text-terracotta uppercase">Phase 1 stub</p>
      <h1 className="mt-3 font-heading text-4xl text-ink">{title}</h1>
      {note ? <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-muted">{note}</p> : null}
    </main>
  );
}
