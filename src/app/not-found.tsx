import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-black text-reef-blue/20 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6">Page Not Found</h2>
      <Link href="/" className="px-6 py-3 bg-reef-blue text-white rounded-2xl font-bold hover:bg-reef-dark transition-colors">
        Go Home
      </Link>
    </div>
  );
}
