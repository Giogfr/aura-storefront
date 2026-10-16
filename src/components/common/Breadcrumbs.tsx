import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PageType, RouteParams } from '../../types';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  page?: PageType;
  params?: RouteParams;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigateTo } = useStore();

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center text-xs text-neutral-500 py-3 overflow-x-auto no-scrollbar whitespace-nowrap"
    >
      <button
        type="button"
        onClick={() => navigateTo('home')}
        className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
      >
        <Home className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const targetPage = item.page;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3 h-3 mx-2 text-neutral-400 shrink-0" aria-hidden="true" />
            {targetPage && !isLast ? (
              <button
                type="button"
                onClick={() => navigateTo(targetPage, item.params)}
                className="hover:text-neutral-900 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </button>
            ) : (
              <span
                aria-current={isLast ? 'page' : undefined}
                className="text-neutral-900 font-medium truncate max-w-[240px]"
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
