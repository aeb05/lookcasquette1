const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(42_100%_50%_/_0.04)_0%,_transparent_70%)]" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center space-y-6 px-4">
        <div className="opacity-0 animate-fade-up">
          <p className="text-muted-foreground text-sm tracking-[0.35em] uppercase font-medium mb-6">
            Collection Premium 2026
          </p>
          <h1 className="font-display text-8xl sm:text-9xl md:text-[12rem] leading-[0.85] tracking-[0.04em] text-foreground">
            L<span className="text-gradient">OO</span>K
          </h1>
          <p className="font-display text-2xl sm:text-3xl md:text-4xl tracking-[0.25em] text-muted-foreground mt-2">
            CASQUETTE
          </p>
        </div>

        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Des casquettes au style unique, conçues pour ceux qui veulent se démarquer. Qualité premium, livraison partout au Maroc.
          </p>
        </div>

        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="#products"
            className="inline-flex items-center gap-3 mt-4 border-2 border-primary text-primary px-10 py-4 font-display text-xl tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all duration-500 glow-primary group"
          >
            VOIR LA COLLECTION
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
