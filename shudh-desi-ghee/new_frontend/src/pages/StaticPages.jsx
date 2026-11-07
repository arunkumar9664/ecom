import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { catalogImages } from '../config/media';
import { aboutStory, contactNotes, faqGroups, policies } from '../content/siteCopy';
import SafeImage from '../components/SafeImage';
import Reveal from '../components/ui/Reveal';
import Diamond from '../components/ui/Diamond';

function PageTitle({ title, description }) {
  useDocumentTitle(title, description || `${title} at Field & Hearth.`);
  return null;
}

export function AboutPage() {
  return <StoryPage />;
}

export function StoryPage() {
  const story = aboutStory;
  return (
    <main>
      <PageTitle title="Our story" description={story.lede} />
      <section className="relative flex min-h-[280px] items-end md:min-h-[420px]">
        <SafeImage src={catalogImages.hero1} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-olive/45" />
        <div className="relative mx-auto w-full max-w-[1100px] px-4 py-12 text-paper md:px-8">
          <h1 className="max-w-xl font-heading text-4xl md:text-6xl">{story.headline}</h1>
          <p className="mt-3 max-w-lg font-body text-sm md:text-base">{story.lede}</p>
        </div>
      </section>
      {story.sections.map((section, index) => (
        <Reveal key={section.title}>
          <section className={`mx-auto grid max-w-[1100px] items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-8 ${index % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <SafeImage src={index % 2 ? catalogImages.heroSide1 : catalogImages.heroSide2} alt="" className="aspect-[4/3] w-full object-cover" />
            <div>
              <h2 className="font-heading text-3xl text-ink">{section.title}</h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-muted">{section.body}</p>
            </div>
          </section>
        </Reveal>
      ))}
      <section className="bg-sand px-4 py-12 md:px-8">
        <h2 className="text-center font-heading text-3xl text-ink">How it is made</h2>
        <ol className="mx-auto mt-8 grid max-w-[1100px] gap-6 md:grid-cols-4">
          {story.steps.map((step, index) => (
            <li key={step.title} className="border-t border-line pt-4">
              <p className="font-body text-xs tracking-[0.16em] text-terracotta">{String(index + 1).padStart(2, '0')}</p>
              <p className="mt-2 font-heading text-xl text-ink">{step.title}</p>
              <p className="mt-1 font-body text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto grid max-w-[1100px] gap-4 px-4 py-12 sm:grid-cols-2 md:px-8">
        {story.values.map((value) => (
          <article key={value.title} className="rounded-[4px] bg-white p-5 shadow-[0_8px_30px_rgba(43,38,32,0.05)]">
            <h3 className="font-heading text-2xl text-ink">{value.title}</h3>
            <p className="mt-2 font-body text-sm text-muted">{value.text}</p>
          </article>
        ))}
      </section>
      <blockquote className="bg-olive px-4 py-12 text-center text-paper md:px-8">
        <p className="mx-auto max-w-2xl font-heading text-3xl">“{story.quote}”</p>
        <footer className="mt-4 font-body text-xs tracking-[0.16em] uppercase">{story.quoteBy}</footer>
      </blockquote>
      <section className="px-4 py-14 text-center">
        <Diamond />
        <h2 className="mt-4 font-heading text-3xl text-ink">See what is on the bench</h2>
        <Link to="/shop" className="mt-6 inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Browse the shop</Link>
      </section>
    </main>
  );
}

export function ContactPage() {
  const { storeSettings, sections } = useShop();
  const phone = storeSettings?.displayPhone || storeSettings?.phone;
  const email = storeSettings?.email;
  const address = storeSettings?.address;
  const hours = storeSettings?.hours;
  const map = storeSettings?.googleMaps;
  const whatsapp = storeSettings?.whatsapp || storeSettings?.phone;
  const wa = whatsapp ? (String(whatsapp).startsWith('http') ? whatsapp : `https://wa.me/${String(whatsapp).replace(/\D/g, '')}`) : '';
  return (
    <main className="mx-auto grid max-w-[1100px] gap-10 px-4 py-12 md:grid-cols-2 md:px-8">
      <PageTitle title="Contact" />
      <div>
        <h1 className="font-heading text-4xl text-ink">Contact</h1>
        {sections.settings.status === 'loading' ? <p className="mt-4 font-body text-sm">Loading workshop details</p> : null}
        {sections.settings.status === 'error' ? <p className="mt-4 font-body text-sm text-terracotta" role="alert">{sections.settings.error}</p> : null}
        <ul className="mt-6 space-y-3 font-body text-sm text-ink">
          {address ? <li>{address}</li> : null}
          {hours ? <li>{hours}</li> : null}
          {phone ? <li><a className="underline" href={`tel:${storeSettings.phone}`}>{phone}</a></li> : null}
          {email ? <li><a className="underline" href={`mailto:${email}`}>{email}</a></li> : null}
          {map ? <li><a className="underline" href={map} target="_blank" rel="noreferrer">Map</a></li> : null}
        </ul>
        {!phone && !email && sections.settings.status === 'ready' ? <p className="mt-4 font-body text-sm text-muted">Contact details are not published yet.</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {wa ? <a href={wa} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">WhatsApp</a> : null}
          {email ? <a href={`mailto:${email}`} className="inline-flex h-11 items-center border border-ink px-5 font-body text-xs tracking-[0.14em] uppercase">Email</a> : null}
        </div>
      </div>
      <div>
        <h2 className="font-heading text-3xl text-ink">Before you write</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {contactNotes.map((note) => (
            <li key={note.q} className="py-4">
              <p className="font-heading text-xl text-ink">{note.q}</p>
              <p className="mt-1 font-body text-sm text-muted">{note.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function PolicyPage({ policy }) {
  return (
    <main className="mx-auto grid max-w-[1100px] gap-8 px-4 py-12 md:grid-cols-[200px_minmax(0,65ch)] md:px-8">
      <PageTitle title={policy.title} />
      <aside className="md:sticky md:top-6 md:self-start">
        <p className="rounded-[3px] bg-sand px-3 py-2 font-body text-xs text-ink">Placeholder. The client’s own text replaces this page.</p>
        <nav aria-label="On this page" className="mt-4 hidden md:block">
          <ul className="space-y-2">
            {policy.sections.map((section) => (
              <li key={section.id}><a href={`#${section.id}`} className="font-body text-sm text-muted hover:text-ink">{section.title}</a></li>
            ))}
          </ul>
        </nav>
      </aside>
      <article>
        <h1 className="font-heading text-4xl text-ink">{policy.title}</h1>
        <p className="mt-2 font-body text-xs tracking-[0.12em] text-muted uppercase">Last updated {policy.updated}</p>
        {policy.sections.map((section) => (
          <section key={section.id} id={section.id} className="mt-8 scroll-mt-24">
            <h2 className="font-heading text-2xl text-ink">{section.title}</h2>
            <p className="mt-2 font-body text-base leading-7 text-ink">{section.body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}

export function DeliveryPage() {
  return <PolicyPage policy={policies.delivery} />;
}
export function PrivacyPage() {
  return <PolicyPage policy={policies.privacy} />;
}
export function TermsPage() {
  return <PolicyPage policy={policies.terms} />;
}
export function RefundPage() {
  return <PolicyPage policy={policies.refund} />;
}

export function FaqPage() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState('');
  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqGroups.map((group) => ({
      ...group,
      items: group.items.filter((item) => !needle || `${item.q} ${item.a}`.toLowerCase().includes(needle)),
    })).filter((group) => group.items.length);
  }, [query]);
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <PageTitle title="Questions" />
      <h1 className="font-heading text-4xl text-ink">Questions</h1>
      <label className="mt-6 block font-body text-sm">Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-1 h-11 w-full border border-line bg-white px-3" />
      </label>
      {groups.map((group) => (
        <section key={group.id} className="mt-8">
          <h2 className="font-body text-xs tracking-[0.16em] text-terracotta uppercase">{group.title}</h2>
          <div className="mt-2 divide-y divide-line border-y border-line">
            {group.items.map((item) => {
              const key = `${group.id}-${item.q}`;
              const shown = open === key;
              return (
                <div key={key}>
                  <button type="button" aria-expanded={shown} className="flex min-h-11 w-full items-center justify-between py-3 text-left font-heading text-xl" onClick={() => setOpen(shown ? '' : key)}>
                    {item.q}
                    <span aria-hidden="true">{shown ? '−' : '+'}</span>
                  </button>
                  {shown ? <p className="pb-4 font-body text-sm leading-relaxed text-muted">{item.a}</p> : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      {!groups.length ? <p className="mt-6 font-body text-sm text-muted">Nothing matches that search.</p> : null}
    </main>
  );
}

const NOTES = [
  { title: 'On curing soap', body: 'A bar sits before it is wrapped. The wait is part of the piece, not a delay.' },
  { title: 'On linen', body: 'Lengths are cut when the cloth is in the workshop. We do not list a weave we cannot hold.' },
  { title: 'On attar', body: 'The oils are alcohol-free and bottled in small glass. A note is a suggestion, not a department filter.' },
];

export function JournalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-8">
      <PageTitle title="Journal" />
      <h1 className="font-heading text-4xl text-ink">Journal</h1>
      <ul className="mt-8 space-y-8">
        {NOTES.map((note) => (
          <li key={note.title}>
            <h2 className="font-heading text-2xl">{note.title}</h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export function NotFoundPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { categories } = useShop();
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <PageTitle title="Page not found" />
      <p className="font-heading text-7xl text-ink">404</p>
      <p className="mt-3 font-body text-sm text-muted">That address is not in the shop.</p>
      <form
        className="mt-6 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(query.trim() ? `/shop?search=${encodeURIComponent(query.trim())}` : '/shop');
        }}
      >
        <label className="sr-only" htmlFor="missing-search">Search the shop</label>
        <input id="missing-search" value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 flex-1 border border-line bg-white px-3 font-body text-sm" placeholder="Search the shop" />
        <button type="submit" className="h-11 bg-olive px-4 font-body text-xs tracking-[0.14em] text-paper uppercase">Search</button>
      </form>
      <ul className="mt-8 flex flex-wrap justify-center gap-3">
        {(categories || []).slice(0, 6).map((category) => (
          <li key={category.slug}>
            <Link to={`/category/${category.slug}`} className="inline-flex h-11 items-center border border-line px-3 font-body text-sm">{category.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
