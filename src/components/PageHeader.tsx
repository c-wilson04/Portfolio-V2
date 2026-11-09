import type { ReactNode } from "react";
import { ArrowLeftIcon } from "./Icons";
import "./PageHeader.css";

type PageHeaderProps = {
  label: string;
  title: string;
  back: { href: string; label: string };
  children?: ReactNode;
};

export default function PageHeader({ label, title, back, children }: PageHeaderProps) {
  return (
    <header className="page-head container">
      <a className="page-head__back" href={back.href}>
        <ArrowLeftIcon />
        {back.label}
      </a>
      <p className="label">{label}</p>
      <h1>{title}</h1>
      {children && <div className="page-head__intro">{children}</div>}
    </header>
  );
}
