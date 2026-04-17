import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { quizQuestions } from "../data/quiz";
import { destinations } from "../data/destinations";
import DestinationCard from "./DestinationCard";

export default function QuizModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const total = quizQuestions.length;
  const done = result !== null;

  function reset() {
    setStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function submit(finalAnswers) {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        answers: quizQuestions.map((q) => ({
          question: q.question,
          answer: finalAnswers[q.id],
        })),
      };
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? JSON.stringify(data?.error ?? data));
      setResult(data);
    } catch (err) {
      setError(err.message || "Erreur de recommandation");
    } finally {
      setLoading(false);
    }
  }

  function chooseOption(opt) {
    const q = quizQuestions[step];
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      submit(next);
    }
  }

  const current = quizQuestions[step];
  const recommended = result
    ? destinations.find((d) => d.id === result.destinationId)
    : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-ink-800 border border-gold-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-ink-700 hover:bg-ink-600 text-gray-300 flex items-center justify-center transition"
              aria-label="Fermer le quiz"
            >
              ✕
            </button>

            {/* Progress bar (hidden on result) */}
            {!done && !loading && (
              <div className="px-8 pt-8">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span className="uppercase tracking-widest">
                    Quiz · Question {step + 1}/{total}
                  </span>
                </div>
                <div className="h-1 bg-ink-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold-500"
                    initial={false}
                    animate={{ width: `${((step + 1) / total) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            <div className="p-8">
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-16 text-center"
                  >
                    <div className="inline-flex gap-1 mb-4">
                      <span className="w-3 h-3 bg-gold-500 rounded-full animate-pulse" />
                      <span className="w-3 h-3 bg-gold-500 rounded-full animate-pulse [animation-delay:150ms]" />
                      <span className="w-3 h-3 bg-gold-500 rounded-full animate-pulse [animation-delay:300ms]" />
                    </div>
                    <p className="text-gray-300 font-serif text-lg">
                      Notre IA analyse votre profil temporel…
                    </p>
                  </motion.div>
                )}

                {!loading && !done && (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-6">
                      {current.question}
                    </h3>
                    <div className="space-y-3">
                      {current.options.map((opt) => (
                        <motion.button
                          key={opt}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => chooseOption(opt)}
                          className="w-full text-left px-5 py-4 rounded-xl bg-ink-700 hover:bg-ink-600 border border-ink-600 hover:border-gold-500/60 text-gray-100 transition"
                        >
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {!loading && done && recommended && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="pt-4"
                  >
                    <p className="uppercase tracking-[0.4em] text-gold-500 text-xs mb-3 text-center">
                      Votre destination idéale
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">
                      {recommended.name}
                    </h3>
                    <p className="text-gray-300 text-center leading-relaxed mb-8 italic">
                      “{result.explanation}”
                    </p>

                    <div className="max-w-sm mx-auto">
                      <DestinationCard destination={recommended} />
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={reset}
                        className="px-6 py-2 rounded-full border border-gray-500 text-gray-200 hover:border-gold-500 hover:text-gold-500 transition text-sm"
                      >
                        Refaire le quiz
                      </button>
                      <button
                        onClick={handleClose}
                        className="px-6 py-2 rounded-full bg-gold-500 text-ink-900 font-semibold hover:bg-gold-400 transition text-sm"
                      >
                        Fermer
                      </button>
                    </div>
                  </motion.div>
                )}

                {!loading && error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center"
                  >
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                      onClick={reset}
                      className="px-6 py-2 rounded-full bg-gold-500 text-ink-900 font-semibold hover:bg-gold-400 transition text-sm"
                    >
                      Recommencer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
