import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component
 * Shows navigation path
 */
export const Breadcrumbs = ({ items = [] }) => {
    if (items.length === 0) return null;

    return (
        <nav className="flex items-center gap-2 mb-6" aria-label="Breadcrumb" style={{ fontSize: 'var(--font-size-base)' }}>
            <a
                href="/"
                className="transition-colors flex items-center gap-1"
                style={{ color: 'var(--gray-text)', textDecoration: 'underline' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray-text)'}
            >
                <Home size={14} />
                <span>Home</span>
            </a>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        <ChevronRight size={14} style={{ color: 'var(--gray-text)' }} />
                        {isLast ? (
                            <span style={{ color: 'var(--gray-text-dark)', fontWeight: 'var(--font-weight-semibold)' }}>{item.label}</span>
                        ) : (
                            <a
                                href={item.href || '#'}
                                onClick={item.onClick}
                                className="transition-colors"
                                style={{ color: 'var(--gray-text)', textDecoration: 'underline' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray-text)'}
                            >
                                {item.label}
                            </a>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
