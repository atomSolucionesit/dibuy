import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import WhatsAppBubble from "@/components/WhatsApp";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Features />
      {/* <Newsletter /> */}
      <Footer />
      <WhatsAppBubble />
    </main>
  );
}
