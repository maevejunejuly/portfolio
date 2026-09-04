import Link from "next/link";
import type { Project } from "../../lib/projects";

export default function ProjectLink({
  project,
  className,
  children,
  ...rest
}: {
  project: Project;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Link
      href={`/catalog/${project.slug}`}
      draggable={false}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}
