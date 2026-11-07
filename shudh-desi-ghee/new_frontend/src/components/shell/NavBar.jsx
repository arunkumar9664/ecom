import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { shellNav } from '../../config/nav';
import MegaMenu from './MegaMenu';

export default function NavBar() {
  const { categories, sections } = useShop();
  const items = shellNav(categories);
  const [open, setOpen] = useState(false);
  const { pathname, search } = useLocation();
  const here = `${pathname}${search}`;

  return (
    <nav
      className="relative z-10 hidden border-y border-line bg-sand min-[1000px]:block"
      aria-label="Departments"
      onMouseLeave={() => setOpen(false)}
    >
      <ul className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-7 px-6">
        {sections.categories.status === 'error' ? (
          <li className="py-3 font-body text-sm text-terracotta">{sections.categories.error}</li>
        ) : null}
        {items.map((item) => {
          const opensMenu = Boolean(item.slug);
          const current = item.to.includes('?') ? here === item.to : pathname === item.to;
          return (
            <li key={item.to} onMouseEnter={() => setOpen(opensMenu)}>
              <Link
                to={item.to}
                aria-current={current ? 'page' : undefined}
                className={`group relative inline-flex items-baseline py-3.5 font-body text-[14px] ${current ? 'text-olive' : 'text-ink'} hover:text-olive`}
              >
                {item.label}
                {item.badge ? <span className="ml-1 font-body text-[9px] font-semibold tracking-[0.14em] text-gold uppercase">{item.badge}</span> : null}
                <span className={`absolute bottom-2 left-0 h-px bg-gold motion-reduce:transition-none ${current ? 'w-full' : 'w-0 transition-[width] duration-200 group-hover:w-full'}`} aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
      {open ? <MegaMenu categories={categories} onNavigate={() => setOpen(false)} /> : null}
    </nav>
  );
}
