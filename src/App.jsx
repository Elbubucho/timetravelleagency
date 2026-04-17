import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import DestinationsSection from "./components/DestinationsSection";
import QuizSection from "./components/QuizSection";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <DestinationsSection />
        <QuizSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
