export default function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`container px-2.5 mx-auto h-full flex flex-col ${className ?? ''}`}>
    {children}
  </div>
}


