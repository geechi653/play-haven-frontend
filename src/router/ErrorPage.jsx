import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ErrorPage() {
  const [countdown, setCountdown] = useState(3);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setRedirect(true);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (redirect) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="text-center min-vh-100 d-flex flex-column justify-content-center align-items-center"
         style={{background: 'linear-gradient(135deg, rgba(61, 18, 94, 0.85) 0%, rgba(118, 69, 201, 0.75) 50%, rgba(117, 42, 187, 0.65) 100%)'}}>
      <h1 className="text-white mb-4">Page Not Found</h1>
      <p className="text-white mb-4">Redirecting to home page in {countdown} seconds...</p>
      <div className="text-center btn-group">
        <Link
          className="text-decoration-none btn btn-primary btn-lg"
          to="/home"
        >
          Go to Home Now
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
