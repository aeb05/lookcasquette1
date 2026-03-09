import { ShoppingCart, Menu, X, Settings } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-18 flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-1.5 group">
          <span className="font-display text-3xl tracking-[0.15em] text-foreground transition-colors">
            LOOK
          </span>
          <span className="font-display text-3xl tracking-[0.15em] text-primary">
            CASQUETTE
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#products" className="line-reveal text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase pb-1">
            Collection
          </a>
          <a href="#about" className="line-reveal text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase pb-1">
            À Propos
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Admin"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-display text-lg tracking-wider hover:bg-primary-glow transition-colors glow-primary"
          >
            <ShoppingCart size={18} />
            PANIER
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center text-xs font-body font-bold">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <a href="#products" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase py-2">
              Collection
            </a>
            <a href="#about" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wide uppercase py-2">
              À Propos
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
