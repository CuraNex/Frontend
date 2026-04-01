import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export const PageHeader = ({ title, description, children }: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h1 className="text-3xl font-bold uppercase" style={{ fontFamily: "'Clash Grotesk', sans-serif" }}>
        {title}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    {children && <div className="flex items-center gap-2">{children}</div>}
  </div>
);
