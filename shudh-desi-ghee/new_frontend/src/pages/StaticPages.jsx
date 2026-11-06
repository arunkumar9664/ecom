import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';

function Shell({ title, children }) {
  useDocumentTitle(title, `${title} at Field & Hearth.`);
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <h1 className="font-heading text-4xl text-ink">{title}</h1>
      <div className="mt-6 space-y-4 font-body text-sm leading-relaxed text-ink">{children}</div>
    </main>
  );
}

export function AboutPage() {
  // TODO(client): replace this placeholder with the workshop story.
  return (
    <Shell title="About">
      <p>Field & Hearth is a small workshop for soap, candles, linen, bags, and alcohol-free attars. The work is mixed, poured, or stitched in short runs and packed in plain paper.</p>
      <p>This page is a placeholder until the workshop writes the public story.</p>
    </Shell>
  );
}

export function StoryPage() {
  // TODO(client): replace this placeholder with the origin story.
  return (
    <Shell title="Our story">
      <p>The workshop began as a bench for soap and linen, then grew only when a new piece could be made by the same hands. Nothing here is filled in from another brand.</p>
    </Shell>
  );
}

export function ContactPage() {
  // TODO(client): confirm the public phone, email, and WhatsApp before launch.
  const { storeSettings, sections } = useShop();
  const phone = storeSettings?.phone;
  const email = storeSettings?.email;
  const whatsapp = storeSettings?.whatsapp || phone;
  const address = storeSettings?.address;
  const wa = whatsapp
    ? (String(whatsapp).startsWith('http') ? whatsapp : `https://wa.me/${String(whatsapp).replace(/\D/g, '')}`)
    : '';
  return (
    <Shell title="Contact">
      {sections.settings.status === 'error' ? <p role="alert">{sections.settings.error}</p> : null}
      {sections.settings.status === 'loading' ? <p>Loading workshop details</p> : null}
      {address ? <p>{address}</p> : null}
      {phone ? <p><a className="underline" href={`tel:${phone}`}>{phone}</a></p> : null}
      {email ? <p><a className="underline" href={`mailto:${email}`}>{email}</a></p> : null}
      {wa ? <p><a className="underline" href={wa} target="_blank" rel="noreferrer">WhatsApp the workshop</a></p> : null}
      {!phone && !email && sections.settings.status === 'ready' ? <p>Contact details are not published yet.</p> : null}
    </Shell>
  );
}

export function DeliveryPage() {
  // TODO(client): replace with the real dispatch and returns policy.
  return (
    <Shell title="Delivery and returns">
      <p>Parcels leave the workshop in plain packing. Shipping cost and the free-shipping threshold come from the shop settings and are shown in the bag.</p>
      <p>If a piece arrives damaged, write to the workshop with the order id and a photo. This page is a placeholder until the client supplies the full policy.</p>
    </Shell>
  );
}

export function PrivacyPage() {
  // TODO(client): replace with the legal privacy policy.
  return (
    <Shell title="Privacy policy">
      <p>We keep the name, email, phone, and address you give us so an order can be packed and a confirmation can be sent. We do not sell that information.</p>
      <p>This is placeholder copy and is not legal advice.</p>
    </Shell>
  );
}

export function TermsPage() {
  // TODO(client): replace with the terms of use.
  return (
    <Shell title="Terms of use">
      <p>Using this shop means you place orders for handmade goods as described on each product page. Prices include tax as shown. The server total is the amount charged.</p>
      <p>This is placeholder copy for the client to replace.</p>
    </Shell>
  );
}

export function RefundPage() {
  // TODO(client): replace with the refund and exchange policy.
  return (
    <Shell title="Refund and exchange">
      <p>Opened soap, candles, and attars are not returned. Unopened linen and bags can be exchanged if you write within a few days of delivery and the piece is unused.</p>
      <p>This is placeholder copy until the client confirms the policy.</p>
    </Shell>
  );
}

const FAQS = [
  ['How long does a parcel take?', 'Dispatch timing is shown at checkout once shop settings load. We do not promise a pin-code date.'],
  ['Can I track a guest order?', 'Guest orders send an email confirmation and cannot be looked up later. Sign in before you pay if you want the order on your account.'],
  ['Do you ship alcohol?', 'The attars are alcohol-free. We do not sell liquor.'],
];

export function FaqPage() {
  // TODO(client): replace these questions with the workshop's own answers.
  const [open, setOpen] = useState(0);
  return (
    <Shell title="Questions">
      <div className="divide-y divide-line border-y border-line">
        {FAQS.map(([question, answer], index) => (
          <div key={question}>
            <button type="button" aria-expanded={open === index} className="flex w-full items-center justify-between py-4 text-left font-heading text-xl" onClick={() => setOpen(open === index ? -1 : index)}>
              {question}
              <span aria-hidden="true">{open === index ? '−' : '+'}</span>
            </button>
            {open === index ? <p className="pb-4 text-muted">{answer}</p> : null}
          </div>
        ))}
      </div>
    </Shell>
  );
}

const NOTES = [
  { title: 'On curing soap', body: 'A bar sits before it is wrapped. The wait is part of the piece, not a delay.' },
  { title: 'On linen', body: 'Lengths are cut when the cloth is in the workshop. We do not list a weave we cannot hold.' },
  { title: 'On attar', body: 'The oils are alcohol-free and bottled in small glass. A note is a suggestion, not a department filter.' },
];

export function JournalPage() {
  // TODO(client): replace this static list when a journal exists. There is no blog endpoint.
  return (
    <Shell title="Journal">
      <ul className="space-y-6">
        {NOTES.map((note) => (
          <li key={note.title}>
            <h2 className="font-heading text-2xl">{note.title}</h2>
            <p className="mt-2 text-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </Shell>
  );
}

export function NotFoundPage() {
  return (
    <Shell title="Page not found">
      <p>That address is not in the shop.</p>
      <Link to="/shop" className="inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Browse the shop</Link>
    </Shell>
  );
}
