import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { shellNav } from '../../config/nav';
import useScrollHysteresis from '../../hooks/useScrollHysteresis';

export default function MobileNav() {
  const { categories, sections } = useShop();
  const items = shellNav(categories);
  const { pathname, search } = useLocation();
  const here = `${pathname}${search}`;
  const { shown } = useScrollHysteresis({ topThreshold: 80, downThreshold: 24, upThreshold: 12 });

  return (
    <nav
      aria-label="Departments"
      className={`edge-fade overflow-hidden border-b bg-paper transition-[max-height,opacity,border-color] duration-200 ease-in-out motion-reduce:transition-none min-[1000px]:hidden ${
        !shown
          ? 'max-h-0 opacity-0 border-b-transparent pointer-events-none'
          : 'max-h-11 opacity-100 border-b-line'
      }`}
      style={{ willChange: 'max-height, opacity' }}
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
