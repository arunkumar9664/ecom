import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { shellNav } from '../../config/nav';

export default function MobileNav() {
  const { categories, sections } = useShop();
  const items = shellNav(categories);
  const { pathname, search } = useLocation();
  const here = `${pathname}${search}`;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > last + 8 && y > 48) setHidden(true);
      else if (y < last - 8) setHidden(false);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Departments"
      className={`edge-fade overflow-hidden border-b border-line bg-paper transition-[max-height] duration-200 motion-reduce:transition-none min-[1000px]:hidden ${hidden ? 'max-h-0 border-b-0' : 'max-h-11'}`}
    >
      <ul className="no-scrollbar flex h-11 items-center gap-0 overflow-x-auto px-gutter">
        {sections.categories.status === 'error' ? (
          <li className="font-body text-sm text-terracotta">{sections.categories.error}</li>
        ) : null}
        {items.map((item, index) => {
          const current = item.to.includes('?') ? here === item.to : pathname === item.to;
          return (
            <li key={item.to} className="flex shrink-0 items-center">
              {index > 0 ? <span aria-hidden="true" className="mx-2 inline-block h-1 w-1 rotate-45 bg-terracotta" /> : null}
              <Link
                to={item.to}
                aria-current={current ? 'page' : undefined}
                className={`inline-flex h-11 items-center font-heading text-[15px] whitespace-nowrap ${current ? 'text-olive' : 'text-ink'}`}
              >
                {item.label}
                {item.badge ? <span className="ml-1 font-body text-[9px] font-semibold tracking-[0.14em] text-gold uppercase">{item.badge}</span> : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
