import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import Interactive from './components/Interactive.jsx';
import Services from './components/Services.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="grain min-h-screen bg-ink text-bone">
      <Nav />
      <main>
        <Hero />
        <Work />
        <Interactive />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
