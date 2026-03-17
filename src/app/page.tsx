import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Products from '@/components/Products';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Refill from '@/components/Refill';
import KakaoFloat from '@/components/KakaoFloat';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Products />
      <Refill />
      <ContactForm />
      <Footer />
      <KakaoFloat />
    </main>
  );
}
