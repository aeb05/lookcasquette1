import { useParams, useNavigate, Link } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CheckoutDialog from "@/components/CheckoutDialog";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: allProducts = [] } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">Produit introuvable</p>
          <button onClick={() => navigate("/")} className="text-primary font-display tracking-wider hover:underline">
            RETOUR À LA BOUTIQUE
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = allProducts.filter((p) => p.id !== product.id && p.category === product.category);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <CheckoutDialog />
      <WhatsAppButton />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm tracking-wider uppercase">Retour à la collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ScrollReveal>
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-card">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-primary glow-primary"
                        : "border-border/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase font-medium mb-2">
                  {product.category}
                </p>
                <h1 className="font-display text-5xl md:text-6xl tracking-wider text-foreground">
                  {product.name}
                </h1>
              </div>

              <span className="font-display text-4xl text-primary">{product.price} MAD</span>

              <p className="text-muted-foreground leading-relaxed text-lg max-w-md">
                {product.description}
              </p>

              <div className="space-y-3 border-t border-border/50 pt-6">
                <p className="font-display text-lg tracking-wider text-foreground">CARACTÉRISTIQUES</p>
                <ul className="space-y-2">
                  {product.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <Check size={14} className="text-primary flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-display text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-lg font-display text-xl tracking-wider transition-all duration-300 ${
                    added
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-primary text-primary-foreground hover:bg-primary-glow glow-primary"
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={20} />
                      AJOUTÉ !
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      AJOUTER AU PANIER
                    </>
                  )}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase font-medium mb-3">
                  Vous aimerez aussi
                </p>
                <h2 className="font-display text-4xl tracking-wider text-foreground">
                  PRODUITS SIMILAIRES
                </h2>
                <div className="w-16 h-0.5 bg-primary mx-auto mt-6" />
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p, i) => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <ProductCard product={p} index={i} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
