export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col flex-grow gap-4">{children}</section>
  );
}
