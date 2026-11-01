import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

const SLOW_AFTER_MS = 4000;

const PageLoader = () => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen flex-col items-center justify-center gap-3 p-4"
    >
      <LoaderCircle className="animate-spin text-primary" size={28} />
      {isSlow && (
        <p className="max-w-xs text-center text-sm text-muted">
          Waking up the server, this can take up to a minute.
        </p>
      )}
    </div>
  );
};

export default PageLoader;
