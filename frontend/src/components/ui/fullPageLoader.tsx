import { Spinner } from './spinner';
import { cn } from '@/lib/utils';

function FullPageLoader({
  label = 'Loading...',
  className,
  ...props
}: React.ComponentProps<'div'> & { label?: string }) {
  return (
    <div
      role="status"
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      <Spinner className="size-10" />
      {label && <p className="mt-4 text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

export { FullPageLoader };
