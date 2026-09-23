import { cn } from '@/lib/utils';

type InfoRowProps = {
  label: string;
  value: string;
  className?: string;
};

function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr] items-center gap-4 py-3 text-left',
        className,
      )}
    >
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-right truncate text-wrap">
        {value}
      </dd>
    </div>
  );
}

export default InfoRow;
