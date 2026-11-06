import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { journalCards } from '../../data/homeStories';

export default function JournalRow() {
  return (
    <section className="px-4 py-12 md:px-8" aria-label="Journal">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-heading text-3xl text-ink md:text-4xl">From the journal</h2>
        <Link to="/journal" className="font-body text-sm tracking-[0.12em] text-ink uppercase underline-offset-4 hover:underline">
          Explore all
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {journalCards.map((card) => (
          <Link key={card.id} to="/journal" className="bg-white">
            <SafeImage src={card.image} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <h3 className="font-heading text-2xl text-ink">{card.title}</h3>
              <p className="mt-2 font-body text-sm text-muted">{card.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
