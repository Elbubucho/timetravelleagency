import { motion } from "framer-motion";

export default function DestinationCard({ destination }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative rounded-2xl overflow-hidden bg-ink-800 border border-ink-600/40 hover:border-gold-500/60 transition-colors flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${destination.color} to-transparent`}
        />
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ink-900/80 text-xs uppercase tracking-wider text-gold-500 border border-gold-500/30">
          {destination.era}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
        <p className="text-gold-500 text-sm italic mb-4">
          {destination.tagline}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          {destination.description}
        </p>

        <ul className="space-y-1 mb-6">
          {destination.highlights.map((h) => (
            <li
              key={h}
              className="text-sm text-gray-300 flex items-start gap-2"
            >
              <span className="text-gold-500 mt-0.5">✦</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Footer pushed to bottom */}
        <div className="mt-auto">
          <div className="flex items-center justify-between pt-4 border-t border-ink-600/40">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                À partir de
              </div>
              <div className="text-xl font-serif text-gold-500">
                {destination.price.toLocaleString("fr-FR")} €
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Durée
              </div>
              <div className="text-sm text-gray-200">{destination.duration}</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 w-full py-3 rounded-full bg-gold-500 text-ink-900 font-semibold hover:bg-gold-400 transition"
          >
            Réserver ce voyage
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
