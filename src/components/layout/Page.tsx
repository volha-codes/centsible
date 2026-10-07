import { useEffect, type ReactNode } from "react";

const Page = ({ title, children }: { title: string; children: ReactNode }) => {
  useEffect(() => {
    document.title = `${title} | Centsible`;
  }, [title]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-content md:text-2xl">
        {title}
      </h1>
      {children}
    </div>
  );
};

export default Page;
