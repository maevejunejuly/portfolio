import Link from "next/link";
import type { Project } from "../../lib/projects";

export default function ProjectLink({
  project,
  className,
  children,
}: {
  project: Project;
  className?: string;
  children: React.ReactNode;
}) {
  if (!project.href) return <div className={className}>{children}</div>;

  const external = project.href.startsWith("http");
  return (
    <Link
      href={project.href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}
