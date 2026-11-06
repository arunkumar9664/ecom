import { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';

const PAGE = 4;

function Stars({ value }) {
  const score = Math.round(Number(value) || 0);
  return (
    <span aria-hidden="true" className="tracking-wide text-gold">
      {'★★★★★'.slice(0, score)}
      <span className="text-line">{'★★★★★'.slice(score)}</span>
    </span>
  );
}

export default function ReviewSection({ productId }) {
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

  const load = (nextPage, append) => {
    setStatus(append ? 'ready' : 'loading');
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
    setPage(1);
    load(1, false);
  }, [productId]);

  const total = pagination?.total ?? reviews.length;
  const hasMore = pagination ? page < pagination.totalPages : false;

  return (
    <section className="px-4 py-12 md:px-8" aria-label="Reviews">
      <h2 className="text-center font-heading text-3xl text-ink md:text-4xl">Reviews</h2>
      {status === 'loading' ? <p className="mt-6 text-center font-body text-sm text-muted">Loading reviews…</p> : null}
      {status === 'error' ? (
        <div className="mt-6 text-center">
          <p className="font-body text-sm text-terracotta">{error}</p>
          <button type="button" onClick={() => load(1, false)} className="mt-4 border border-olive px-4 py-2 font-body text-sm text-olive">Retry</button>
        </div>
      ) : null}
      {status === 'ready' && !reviews.length ? <p className="mt-6 text-center font-body text-sm text-muted">No reviews yet</p> : null}
      {status === 'ready' && reviews.length ? (
        <ul className="mx-auto mt-8 max-w-3xl space-y-6">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-line pb-6">
              <p className="font-body text-sm text-ink">
                <Stars value={review.rating} />
                <span className="sr-only">{review.rating} out of 5</span>
                <span className="ml-2 text-muted">{review.user?.name || 'Customer'}</span>
              </p>
              {review.comment ? <p className="mt-2 font-body text-sm leading-relaxed text-ink">{review.comment}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
      {hasMore ? (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              const next = page + 1;
              setPage(next);
              load(next, true);
            }}
            className="h-11 border border-ink px-5 font-body text-xs tracking-[0.14em] text-ink uppercase"
          >
            Load more
          </button>
        </div>
      ) : null}

      <div className="mx-auto mt-10 max-w-xl">
        {useMockData ? (
          <form className="space-y-3" aria-disabled="true">
            <p className="font-body text-sm text-muted">Mock mode: reviews are not saved.</p>
            <fieldset disabled className="space-y-3 opacity-60">
              <label className="block font-body text-sm text-ink">
                Rating
                <select className="mt-1 h-11 w-full border border-line bg-white px-3" defaultValue="5">
                  {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label className="block font-body text-sm text-ink">
                Comment
                <textarea className="mt-1 w-full border border-line bg-white px-3 py-2" rows={3} />
              </label>
              <button type="button" className="h-11 border border-line px-5 font-body text-sm text-muted">Send review</button>
            </fieldset>
          </form>
        ) : null}
        {!useMockData && canReview ? (
          <form
            className="space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              setSending(true);
              try {
                await submitProductReview(productId, { rating: Number(rating), comment });
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
            <label className="block font-body text-sm text-ink">
              Rating
              <select value={rating} onChange={(event) => setRating(event.target.value)} className="mt-1 h-11 w-full border border-line bg-white px-3">
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="block font-body text-sm text-ink">
              Comment
              <textarea required value={comment} onChange={(event) => setComment(event.target.value)} className="mt-1 w-full border border-line bg-white px-3 py-2" rows={3} />
            </label>
            <button type="submit" disabled={sending} className="h-11 bg-olive px-5 font-body text-sm text-paper disabled:opacity-60">
              {currentUser ? 'Send review' : 'Send review'}
            </button>
          </form>
        ) : null}
        {!useMockData && !canReview && status !== 'loading' ? (
          <p className="font-body text-sm text-muted">Reviews can be written after your order is delivered.</p>
        ) : null}
        {total > reviews.length && status === 'ready' ? null : null}
      </div>
    </section>
  );
}
