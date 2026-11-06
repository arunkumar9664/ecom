import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { shellNav } from '../../config/nav';
import MegaMenu from './MegaMenu';

export default function NavBar() {
  const { categories, sections } = useShop();
  const items = shellNav(categories);
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="relative z-10 hidden border-t border-line lg:block"
      aria-label="Departments"
      onMouseLeave={() => setOpen(false)}
    >
      <ul className="flex flex-wrap items-center justify-center gap-y-1 px-4">
        {sections.categories.status === 'error' ? (
          <li className="py-3 font-body text-sm text-terracotta">{sections.categories.error}</li>
        ) : null}
        {items.map((item, index) => {
          const opensMenu = Boolean(item.slug);
          return (
            <li
              key={item.to}
              className="flex items-center"
              onMouseEnter={() => setOpen(opensMenu)}
            >
              {index > 0 ? <span className="mx-3 inline-block h-1.5 w-1.5 rotate-45 bg-terracotta" aria-hidden="true" /> : null}
              <Link
                to={item.to}
                className="inline-flex items-center gap-2 py-3 font-heading text-[14px] tracking-[0.08em] text-ink hover:text-olive"
              >
                {item.label}
                {item.badge ? (
                  <span className="bg-terracotta px-1.5 py-0.5 font-body text-[9px] font-semibold tracking-wide text-paper uppercase">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
      {open ? <MegaMenu categories={categories} onNavigate={() => setOpen(false)} /> : null}
    </nav>
  );
}
