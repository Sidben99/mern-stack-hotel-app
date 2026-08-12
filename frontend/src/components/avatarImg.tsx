import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AvatarImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} className={className} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
