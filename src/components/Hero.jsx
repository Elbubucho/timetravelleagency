import { motion } from "framer-motion";
import { fadeUp, heroStagger } from "../lib/motion";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image + overlay */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/80 to-ink-900" />

      {/* Content */}
      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.p
          variants={fadeUp}
          className="uppercase tracking-[0.4em] text-gold-500 text-sm mb-6"
        >
          Agence de voyage temporel
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          Voyagez à travers
          <br />
          <span className="text-gold-500">les époques.</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          Depuis 2089, TimeTravel Agency offre à une clientèle exclusive
          l'accès aux plus grandes époques de l'histoire. Embarquement
          immédiat vers l'impossible.
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#destinations"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-full bg-gold-500 text-ink-900 font-semibold hover:bg-gold-400 transition"
          >
            Explorer les destinations
          </motion.a>
          <motion.a
            href="#about"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-full border border-gray-500 text-gray-200 hover:border-gold-500 hover:text-gold-500 transition"
          >
            En savoir plus
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.8 },
          y: { delay: 1.2, duration: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold-500/60 text-xs tracking-widest"
      >
        ↓ DÉFILER
      </motion.div>
    </section>
  );
}
