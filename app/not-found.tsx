import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="subpage-shell">
      <section className="surface empty-state">
        <p className="eyebrow">404</p>
        <h1>That page does not exist in the portfolio yet.</h1>
        <p className="lead compact">
          The route structure is ready for growth, but this specific page has not been published.
        </p>
        <Link className="button button-primary" href="/">
          Return Home
        </Link>
      </section>
    </main>
  );
}
