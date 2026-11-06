import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { storyImage } from '../../data/homeStories';

export default function OurStory() {
  return (
    <section className="px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-[1360px] items-stretch gap-0 md:grid-cols-2">
        <div className="flex flex-col justify-center border border-line bg-white px-6 py-10 md:px-12">
          <h2 className="font-heading text-4xl text-ink">Our story</h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-muted">
            Field & Hearth started as a small bench for soap and linen. The work is still done in short runs, with ingredients we can name and cloth we can feel.
          </p>
          <Link to="/about" className="mt-8 inline-flex h-11 w-fit items-center border border-ink px-5 font-body text-xs tracking-[0.16em] text-ink uppercase">
            Discover our journey
          </Link>
        </div>
        <SafeImage src={storyImage} alt="A jar from the workshop, standing in until a photograph of the bench is ready" className="aspect-[4/3] h-full w-full object-cover md:aspect-auto md:min-h-[420px]" />
      </div>
    </section>
  );
}
