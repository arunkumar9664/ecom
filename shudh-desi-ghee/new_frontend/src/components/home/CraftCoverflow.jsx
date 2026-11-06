import { useState } from 'react';
import SafeImage from '../SafeImage';
import { craftStories } from '../../data/homeStories';
import { IconChevron } from '../shell/icons';

export default function CraftCoverflow() {
  const [index, setIndex] = useState(0);
  const count = craftStories.length;
  const go = (next) => setIndex((next + count) % count);
  if (!count) return null;
  const offsets = count === 1 ? [0] : count === 2 ? [0, 1] : [-1, 0, 1];
  const visible = offsets.map((offset) => craftStories[(index + offset + count) % count]);

  return (
    <section aria-roledescription="carousel" aria-label="Behind the craft" className="bg-sand px-4 py-12 md:px-8">
      <h2 className="text-center font-heading text-3xl text-ink md:text-4xl">Behind the craft</h2>
      <div className="mx-auto mt-8 flex max-w-5xl items-center justify-center gap-2 overflow-hidden md:gap-4">
        {visible.map((story, position) => {
              const centre = count < 3 ? position === 0 : position === 1;
          return (
            <article
              key={story.id}
              aria-hidden={!centre}
              className={`shrink-0 bg-paper transition-transform duration-300 motion-reduce:transition-none ${count < 3 || centre ? 'w-[62%] scale-100 opacity-100 md:w-[34%]' : 'w-[18%] scale-95 opacity-45 md:w-[26%]'}`}
            >
              <SafeImage src={story.image} alt="" className="aspect-[4/5] w-full object-cover" />
              <div className={`p-3 md:p-4 ${centre ? '' : 'hidden md:block'}`}>
                <h3 className="font-heading text-xl text-ink md:text-2xl">{story.title}</h3>
                <p className="mt-1 font-body text-sm text-muted">{story.text}</p>
              </div>
            </article>
          );
        })}
      </div>
      {count > 1 ? <div className="mt-6 flex justify-center gap-3">
        <button type="button" aria-label="Previous story" onClick={() => go(index - 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
          <IconChevron className="h-4 w-4 rotate-180" />
        </button>
        <button type="button" aria-label="Next story" onClick={() => go(index + 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
          <IconChevron className="h-4 w-4" />
        </button>
      </div> : null}
    </section>
  );
}
