import { motion } from "framer-motion";
import { destinations } from "../data/destinations";
import DestinationCard from "./DestinationCard";
import { fadeUp, staggerContainer, viewportOnce } from "../lib/motion";

export default function DestinationsSection() {
  return (
    <section
      id="destinations"
      className="py-24 px-6 border-t border-ink-600/40"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeUp}
            className="uppercase tracking-[0.4em] text-gold-500 text-sm mb-4"
          >
            Nos destinations
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Trois époques, trois aventures
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Chaque voyage est conçu comme une immersion totale. Choisissez
            l'époque qui fera battre votre cœur.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {destinations.map((d) => (
            <motion.div key={d.id} variants={fadeUp} className="h-full">
              <DestinationCard destination={d} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
