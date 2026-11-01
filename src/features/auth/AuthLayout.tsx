import { useEffect, type ReactNode } from "react";

import Logo from "../../components/Logo";
import Card from "../../components/ui/Card";

const AuthLayout = ({
  title,
  footer,
  children,
}: {
  title: string;
  footer: ReactNode;
  children: ReactNode;
}) => {
  useEffect(() => {
    document.title = `${title} | Centsible`;
  }, [title]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center justify-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold text-content">Centsible</span>
        </div>

        <Card header={title}>{children}</Card>

        <p className="text-center text-sm text-muted">{footer}</p>
      </div>
    </div>
  );
};

export default AuthLayout;
