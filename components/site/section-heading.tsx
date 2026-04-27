import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  action?: ReactNode;
};

export function SectionHeading({ eyebrow, title, action }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="section-heading__eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
