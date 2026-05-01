import Link from 'next/link';
import type { BlogHeading } from '@/content/blogs';
import type { SiteContent } from '@/content/site';

type BlogOutlineProps = {
  headings: BlogHeading[];
  copy: SiteContent['blogDetail'];
};

export function BlogOutline({ headings, copy }: BlogOutlineProps) {
  if (!headings.length) {
    return null;
  }

  return (
    <details className="surface detail-rail-card rail-disclosure" open>
      <summary className="rail-disclosure__summary">
        <span className="label">{copy.outline}</span>
        <span className="rail-disclosure__hint">{copy.outlineLead}</span>
      </summary>
      <div className="rail-disclosure__body">
        <div className="outline-list">
          {headings.map((heading) => (
            <Link key={heading.id} className={`outline-link outline-link--h${heading.level}`} href={`#${heading.id}`}>
              <span>{heading.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}
