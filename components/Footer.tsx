export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 py-6 md:flex-row">
          <p className="text-sm text-text-secondary">© 2024 Rivora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a className="text-sm text-text-secondary transition-colors hover:text-text-primary" href="/privacy">Privacy Policy</a>
            <a className="text-sm text-text-secondary transition-colors hover:text-text-primary" href="/terms">Terms of Service</a>
            <a className="text-sm text-text-secondary transition-colors hover:text-text-primary" href="/driver-agreement">Driver Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
