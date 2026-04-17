export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-ink-900/70 border-b border-ink-600/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="text-2xl">⧗</span>
          <span className="font-serif text-xl tracking-wide">
            <span className="text-gold-500">Time</span>Travel
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#destinations" className="hover:text-gold-500 transition">
            Destinations
          </a>
          <a href="#about" className="hover:text-gold-500 transition">
            L'agence
          </a>
          <a href="#contact" className="hover:text-gold-500 transition">
            Contact
          </a>
        </nav>
        <a
          href="#destinations"
          className="px-4 py-2 rounded-full bg-gold-500 text-ink-900 text-sm font-semibold hover:bg-gold-400 transition"
        >
          Réserver
        </a>
      </div>
    </header>
  );
}
