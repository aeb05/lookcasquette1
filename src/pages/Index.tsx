import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import CheckoutDialog from "@/components/CheckoutDialog";
import ScrollReveal from "@/components/ScrollReveal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Truck, Shield, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "LIVRAISON RAPIDE", desc: "Partout au Maroc en 24-48h" },
  { icon: Shield, title: "QUALITÉ PREMIUM", desc: "Matériaux sélectionnés avec soin" },
  { icon: Headphones, title: "SUPPORT 24/7", desc: "Nous sommes toujours disponibles" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Trust bar */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="flex items-center gap-4 justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <f.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg tracking-wider text-foreground">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <ScrollReveal>
        <ProductGrid />
      </ScrollReveal>

      {/* About section */}
      <section id="about" className="border-t border-border/50 bg-card/20">
        <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
          <ScrollReveal>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase font-medium mb-3">
              Notre Histoire
            </p>
            <h2 className="font-display text-5xl tracking-wider text-foreground mb-6">
              À PROPOS
            </h2>
            <div className="w-16 h-0.5 bg-primary mx-auto mb-8" />
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-muted-foreground leading-relaxed text-lg">
              LOOK CASQUETTE est née d'une passion pour le streetwear et l'accessoire urbain. 
              Nous sélectionnons des casquettes de qualité premium pour vous offrir un style unique. 
              Chaque pièce est choisie avec soin pour allier confort, durabilité et tendance.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <WhatsAppButton />
      <CartDrawer />
      <CheckoutDialog />

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-display text-2xl tracking-[0.15em] text-foreground">
                LOOK <span className="text-primary">CASQUETTE</span>
              </span>
              <p className="text-muted-foreground text-sm mt-1">
                Casquettes premium au Maroc
              </p>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#products" className="hover:text-foreground transition-colors">Collection</a>
              <a href="#about" className="hover:text-foreground transition-colors">À Propos</a>
            </div>
          </div>
          <div className="border-t border-border/30 mt-8 pt-6 text-center">
            <p className="text-muted-foreground text-xs tracking-wider">
              © 2026 LOOK CASQUETTE — Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
