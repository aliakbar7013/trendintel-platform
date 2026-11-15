"use client";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-transition-wrapper flex-1 flex flex-col w-full">
      {children}
    </div>
  );
}
