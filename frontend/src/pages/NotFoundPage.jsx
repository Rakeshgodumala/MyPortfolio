import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | Rakesh Godumala';
  }, []);

  return (
    <main className="full-center text-center">
      <div>
        <p className="notfound-code text-gradient mb-2">404</p>
        <h1 className="h3 mb-3">This page could not be found</h1>
        <p className="text-muted-pf mb-4">The link may be broken, or the page may have moved.</p>
        <Link to="/" className="btn btn-accent">
          <FiArrowLeft aria-hidden="true" /> Back to portfolio
        </Link>
      </div>
    </main>
  );
}
