interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  variant?: "white" | "lavender";
  className?: string;
}

export function SectionWrapper({
  id,
  children,
  variant = "white",
  className = "",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 ${
        variant === "lavender" ? "bg-bg-lavender" : "bg-white"
      } ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
