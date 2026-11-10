import { useEffect, useState } from 'react';
import { useShop } from '../../hooks/useShop';

const PAGE = 4;
const MAX_COMMENT = 400;

function Stars({ value }) {
  const score = Math.round(Number(value) || 0);
  return (
    <span aria-hidden="true" className="tracking-wide text-gold">
      {'★★★★★'.slice(0, score)}
      <span className="text-line">{'★★★★★'.slice(score)}</span>
    </span>
  );
}

function firstName(name) {
  const part = String(name || '').trim().split(/\s+/)[0];
  return part || 'Customer';
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StarPicker({ value, onChange }) {
  const set = (next) => onChange(Math.min(5, Math.max(1, next)));
  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="flex gap-1"
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
          event.preventDefault();
          set(value + 1);
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
          event.preventDefault();
          set(value - 1);
        }
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          onClick={() => set(star)}
          className={`flex h-11 w-11 items-center justify-center text-xl ${star <= value ? 'text-gold' : 'text-line'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ productId, averageRating = 0, reviewCount = 0 }) {
  const { fetchProductReviews, submitProductReview, useMockData, currentUser } = useShop();
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('loading');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');

  const [seenProduct, setSeenProduct] = useState(productId);
  if (seenProduct !== productId) {
    setSeenProduct(productId);
    setPage(1);
    setStatus('loading');
    setReviews([]);
    setError('');
  }

  const load = (nextPage, append) => {
    if (!append) setStatus('loading');
    fetchProductReviews(productId, nextPage, PAGE).then((result) => {
      if (result.error) {
        setError(result.error);
        setStatus('error');
        return;
      }
      setReviews((current) => (append ? [...current, ...(result.reviews || [])] : (result.reviews || [])));
      setPagination(result.pagination || null);
      setCanReview(Boolean(result.canReview));
      setError('');
      setStatus('ready');
    });
  };

  useEffect(() => {
    const gate = { current: false };
    fetchProductReviews(productId, 1, PAGE).then((result) => {
      if (gate.current) return;
      if (result.error) {
        setError(result.error);
        setStatus('error');
        return;
      }
      setReviews(result.reviews || []);
      setPagination(result.pagination || null);
      setCanReview(Boolean(result.canReview));
      setError('');
      setStatus('ready');
    });
    return () => {
      gate.current = true;
    };
  }, [productId, fetchProductReviews]);

  const total = pagination?.total ?? reviewCount ?? reviews.length;
  const hasMore = pagination ? page < pagination.totalPages : false;
  const average = Number(averageRating) || 0;

  return (
    <section id="reviews" className="scroll-mt-24 px-gutter py-14" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-center font-heading text-3xl text-ink md:text-4xl">Reviews</h2>
      {status === 'loading' ? <p className="mt-8 text-center font-body text-sm text-muted">Loading reviews…</p> : null}
      {status === 'error' ? (
        <div className="mt-8 text-center">
          <p className="font-body text-sm text-terracotta" role="alert">{error}</p>
          <button type="button" onClick={() => load(1, false)} className="mt-4 h-11 border border-olive px-4 font-body text-sm text-olive">Retry</button>
        </div>
      ) : null}
      {status === 'ready' ? (
        <div className="mx-auto mt-10 grid max-w-[1100px] gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[4px] bg-white p-6 text-center shadow-[0_8px_30px_rgba(43,38,32,0.05)]">
            {total > 0 ? (
              <>
                <p className="font-heading text-5xl text-ink">{average.toFixed(1)}</p>
                <p className="mt-2"><Stars value={average} /></p>
                <p className="sr-only">{average} out of 5</p>
                <p className="mt-3 font-body text-sm text-muted">Based on {total} {total === 1 ? 'review' : 'reviews'}</p>
              </>
            ) : (
              <p className="font-heading text-2xl text-ink">No reviews yet</p>
            )}
          </aside>
          <div>
            {reviews.length ? (
              <ul className="space-y-4">
                {reviews.map((review) => (
                  <li key={review.id} className="rounded-[4px] bg-white p-5 shadow-[0_8px_30px_rgba(43,38,32,0.05)]">
                    <p className="font-body text-sm text-ink">
                      <Stars value={review.rating} />
                      <span className="sr-only">{review.rating} out of 5</span>
                    </p>
                    {review.comment ? <p className="mt-3 font-body text-sm leading-relaxed text-ink">{review.comment}</p> : null}
                    <p className="mt-3 font-body text-xs tracking-[0.08em] text-muted uppercase">
                      {firstName(review.user?.name)}
                      {review.createdAt ? ` · ${formatDate(review.createdAt)}` : ''}
                      <span className="ml-2 border border-line px-1.5 py-0.5 text-[10px] tracking-[0.12em] text-olive">Verified buyer</span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-sm text-muted">No reviews yet</p>
            )}
            {hasMore ? (
              <button
                type="button"
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  load(next, true);
                }}
                className="mt-6 h-11 border border-ink px-5 font-body text-xs tracking-[0.14em] text-ink uppercase"
              >
                Load more
              </button>
            ) : null}

            <div className="mt-8">
              {useMockData ? (
                <form aria-disabled="true">
                  <p className="font-body text-sm text-muted">Mock mode: reviews are not saved.</p>
                  <fieldset disabled className="mt-3 space-y-3 opacity-60">
                    <StarPicker value={5} onChange={() => {}} />
                    <textarea className="w-full border border-line bg-white px-3 py-2" rows={3} aria-label="Review" />
                    <button type="button" className="h-11 border border-line px-5 font-body text-sm text-muted">Send review</button>
                  </fieldset>
                </form>
              ) : null}
              {!useMockData && canReview ? (
                <form
                  className="space-y-3"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setFormError('');
                    if (!comment.trim()) {
                      setFormError('Write a short note with your rating.');
                      return;
                    }
                    setSending(true);
                    try {
                      await submitProductReview(productId, { rating: Number(rating), comment: comment.trim() });
                      setComment('');
                      setPage(1);
                      load(1, false);
                    } catch {
                      /* toast already shown */
                    } finally {
                      setSending(false);
                    }
                  }}
                >
                  <p className="font-body text-xs tracking-[0.14em] text-muted uppercase">Write a review</p>
                  <StarPicker value={rating} onChange={setRating} />
                  <label className="block font-body text-sm text-ink">
                    Your note
                    <textarea
                      required
                      maxLength={MAX_COMMENT}
                      value={comment}
                      onChange={(event) => setComment(event.target.value.slice(0, MAX_COMMENT))}
                      className="mt-1 w-full border border-line bg-white px-3 py-2"
                      rows={4}
                    />
                  </label>
                  <p className="font-body text-xs text-muted">{comment.length} / {MAX_COMMENT}</p>
                  {formError ? <p className="font-body text-sm text-terracotta" role="alert">{formError}</p> : null}
                  <button type="submit" disabled={sending || !currentUser} className="h-11 bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">
                    {sending ? 'Sending' : 'Send review'}
                  </button>
                </form>
              ) : null}
              {!useMockData && !canReview && status === 'ready' ? (
                <p className="font-body text-sm text-muted">Reviews can be written after your order is delivered.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
