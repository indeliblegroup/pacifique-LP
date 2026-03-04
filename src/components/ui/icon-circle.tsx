interface IconCircleProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
} as const;

export function IconCircle({
  children,
  size = "md",
  className = "",
}: IconCircleProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-crimson-dark text-white ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
}
