import type { ReactNode } from 'react';

function slugifyHeading(children: ReactNode) {
  const text = Array.isArray(children) ? children.join('') : String(children ?? '');

  return text
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

type HeadingProps = {
  children?: ReactNode;
};

export function MdxH2({ children }: HeadingProps) {
  const id = slugifyHeading(children);

  return (
    <h2 id={id || undefined}>
      <span className="mdx-heading__anchor" aria-hidden="true">
        #
      </span>
      {children}
    </h2>
  );
}

export function MdxH3({ children }: HeadingProps) {
  const id = slugifyHeading(children);

  return (
    <h3 id={id || undefined}>
      <span className="mdx-heading__anchor" aria-hidden="true">
        #
      </span>
      {children}
    </h3>
  );
}
