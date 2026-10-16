import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PageType } from '../../types';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  page?: PageType;
  params?: Record<string, any>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigateTo } = useStore();

  return (
    <nav className="flex items-center text-xs text-neutral-500 py-3 overflow-x-auto no-scrollbar whitespace-nowrap">
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center gap-1 hover:text-neutral-900 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 mx-2 text-neutral-400 shrink-0" />
            {isLast || !item.page ? (
              <span className="text-neutral-900 font-medium truncate max-w-[240px]">{item.label}</span>
            ) : (
              <button
                onClick={() => navigateTo(item.page!, item.params)}
                className="hover:text-neutral-900 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
