import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const WELCOME = {
  role: "assistant",
  content:
    "Bonjour et bienvenue chez TimeTravel Agency. Je suis votre conseiller temporel. Souhaitez-vous un aperçu de nos trois destinations, ou cherchez-vous une époque en particulier ?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function send(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const next = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send only user/assistant messages (system is injected server-side)
          messages: next.filter((m) => m.role !== "system"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? JSON.stringify(data?.error ?? data));
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message || "Erreur de communication");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold-500 text-ink-900 shadow-lg hover:bg-gold-400 transition flex items-center justify-center text-2xl"
        aria-label={open ? "Fermer le chat" : "Ouvrir le chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? "✕" : "💬"}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[min(92vw,380px)] h-[min(80vh,560px)] rounded-2xl bg-ink-800 border border-gold-500/30 shadow-2xl flex flex-col overflow-hidden"
          >
          {/* Header */}
          <div className="px-4 py-3 bg-ink-700 border-b border-ink-600/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500 text-ink-900 flex items-center justify-center text-lg">
              ⧗
            </div>
            <div>
              <div className="font-serif text-gold-500 leading-tight">
                Conseiller TimeTravel
              </div>
              <div className="text-xs text-gray-400">En ligne · réponse immédiate</div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl ${
                    m.role === "user"
                      ? "bg-gold-500 text-ink-900 rounded-br-sm"
                      : "bg-ink-700 text-gray-100 rounded-bl-sm border border-ink-600/50"
                  }`}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <div className="prose-chat">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0 leading-relaxed">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="text-gold-400 font-semibold">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-gray-200">{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 my-2">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 my-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="marker:text-gold-500">{children}</li>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-gold-500 underline hover:text-gold-400"
                            >
                              {children}
                            </a>
                          ),
                          code: ({ children }) => (
                            <code className="bg-ink-900/60 px-1 py-0.5 rounded text-gold-400 text-xs">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-ink-700 text-gray-400 px-3 py-2 rounded-2xl border border-ink-600/50 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
                    <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-400 text-center">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={send}
            className="p-3 border-t border-ink-600/50 bg-ink-800 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez-moi vos questions sur les voyages temporels..."
              className="flex-1 bg-ink-700 border border-ink-600/50 rounded-full px-4 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-gold-500/60"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-full bg-gold-500 text-ink-900 text-sm font-semibold hover:bg-gold-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
