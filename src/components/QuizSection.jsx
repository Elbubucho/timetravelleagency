import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";
import QuizModal from "./QuizModal";

export default function QuizSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        id="quiz"
        className="py-24 px-6 border-t border-ink-600/40 relative overflow-hidden"
      >
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-800/40 to-transparent pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative max-w-4xl mx-auto text-center"
        >
          <motion.p
            variants={fadeUp}
            className="uppercase tracking-[0.4em] text-gold-500 text-sm mb-4"
          >
            Recommandation personnalisée
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Quelle époque est faite pour vous&nbsp;?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Répondez à 4 questions et notre intelligence artificielle
            sélectionne la destination temporelle idéale pour votre profil.
          </motion.p>
          <motion.div variants={fadeUp}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpen(true)}
              className="px-10 py-4 rounded-full bg-gold-500 text-ink-900 font-semibold text-lg hover:bg-gold-400 transition shadow-lg shadow-gold-500/20"
            >
              Commencer le quiz →
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      <QuizModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
