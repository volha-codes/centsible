import { useEffect, type ReactNode } from "react";

const Page = ({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) => {
  useEffect(() => {
    document.title = `${title} | Centsible`;
  }, [title]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-content md:text-2xl">
          {title}
        </h1>
        {actions}
      </div>
      {children}
    </div>
  );
};

export default Page;
