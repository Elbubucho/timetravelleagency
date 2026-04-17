export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-ink-600/40 py-12 px-6 mt-12"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⧗</span>
            <span className="font-serif text-xl">
              <span className="text-gold-500">Time</span>Travel
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Agence de voyage temporel de luxe. Membre de la Fédération
            Internationale du Voyage Chronologique depuis 2089.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-gold-500 mb-3">Contact</h4>
          <p className="text-sm text-gray-400">
            42 rue du Temps<br />
            75001 Paris<br />
            contact@timetravel-agency.fr
          </p>
        </div>
        <div>
          <h4 className="font-serif text-gold-500 mb-3">Projet</h4>
          <p className="text-sm text-gray-400">
            Webapp pédagogique M1 full stack <br />
            Valentin Sala · Kevin Vitali · Clément Machtelinckx . Bremaud Benoit
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-ink-600/40 text-xs text-gray-500 text-center">
        © 2089 TimeTravel Agency — Tous les voyages sont fictifs.
      </div>
    </footer>
  );
}
