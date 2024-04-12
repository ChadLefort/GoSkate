export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <section className="flex flex-grow flex-col gap-4">{children}</section>;
}
