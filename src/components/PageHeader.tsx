export default function PageHeader({children, className}: {children: React.ReactNode, className?: string}) {
  return <h1 className={`text-3xl font-bold my-4 ${className}`}>{children}</h1>
}