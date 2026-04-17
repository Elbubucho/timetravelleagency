import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

export default function About() {
  return (
    <section id="about" className="py-24 px-6 border-t border-ink-600/40">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-5xl mx-auto text-center"
      >
        <motion.p
          variants={fadeUp}
          className="uppercase tracking-[0.4em] text-gold-500 text-sm mb-4"
        >
          L'agence
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-4xl md:text-5xl font-bold mb-8"
        >
          Des voyages que personne d'autre ne peut offrir
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto mb-12"
        >
          Nos capsules temporelles brevetées garantissent une immersion totale
          et sécurisée. Chaque séjour est orchestré par un historien-guide
          exclusif et se déroule dans le plus strict respect de l'intégrité du
          continuum.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "247", l: "Voyages organisés" },
            { n: "100%", l: "Retours garantis" },
            { n: "3", l: "Époques ouvertes" },
          ].map((s) => (
            <motion.div
              key={s.l}
              variants={fadeUp}
              whileHover={{ y: -4, borderColor: "rgba(212, 175, 55, 0.5)" }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-2xl bg-ink-800 border border-ink-600/40"
            >
              <div className="text-4xl font-serif text-gold-500 mb-2">
                {s.n}
              </div>
              <div className="text-gray-400 text-sm uppercase tracking-wider">
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
