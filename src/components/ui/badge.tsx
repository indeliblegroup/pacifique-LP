interface BadgeProps {
  children: React.ReactNode;
  variant?: "outline" | "filled";
  className?: string;
}

export function Badge({
  children,
  variant = "outline",
  className = "",
}: BadgeProps) {
  const variantClasses =
    variant === "filled"
      ? "bg-primary text-white"
      : "border border-border-subtle text-primary";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
