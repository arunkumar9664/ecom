import { useShop } from '../context/ShopContext';

export default function HomePage() {
  const { sections, loadCatalog } = useShop();
  const errors = Object.entries(sections).filter(([, section]) => section.status === 'error');

  return (
    <main className="mx-auto min-h-[50vh] max-w-3xl px-6 py-16">
      {errors.length ? (
        <>
          <h1 className="font-heading text-3xl text-ink">Some of the shop did not load</h1>
          <ul className="mt-4 space-y-2 font-body text-sm text-terracotta">
            {errors.map(([key, section]) => (
              <li key={key}>{section.error}</li>
            ))}
          </ul>
          <button type="button" onClick={loadCatalog} className="mt-6 border border-olive px-4 py-2 font-body text-sm text-olive">
            Retry
          </button>
        </>
      ) : (
        <p className="font-heading text-2xl text-muted">The home page arrives in the next phase.</p>
      )}
    </main>
  );
}
