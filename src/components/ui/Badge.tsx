interface BadgeProps {
  children: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  dot?: boolean;
}

const variantClasses = {
  success: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20',
  warning: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
  danger: 'bg-accent-danger/10 text-accent-danger border-accent-danger/20',
  info: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
  default: 'bg-bg-hover text-text-secondary border-border-subtle',
};

export function Badge({ children, variant = 'default', dot = false }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
