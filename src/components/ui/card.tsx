interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "nucleus" | "team" | "dark";
  className?: string;
}

const variantClasses = {
  default: "bg-white border border-border-subtle rounded-lg p-6",
  nucleus:
    "bg-rose-light border-none rounded-lg p-6 hover:bg-rose-medium transition-colors",
  team: "bg-white border border-border-subtle rounded-lg p-6 text-center",
  dark: "bg-accent-deep text-accent-deep-text rounded-lg p-6",
} as const;

export function Card({
  children,
  variant = "default",
  className = "",
}: CardProps) {
  return (
    <div
      className={`overflow-hidden shadow-sm ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
