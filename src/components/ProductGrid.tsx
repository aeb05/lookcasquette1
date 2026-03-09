import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { Search, ArrowUpDown, Loader2 } from "lucide-react";

type SortOption = "default" | "price-asc" | "price-desc";

const ProductGrid = () => {
  const { data: products = [], isLoading } = useProducts();
  const [active, setActive] = useState<string>("TOUS");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["TOUS", ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    let result = active === "TOUS" ? products : products.filter((p) => p.category === active);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [active, search, sort, products]);

  const cycleSortLabel = () => {
    if (sort === "default") return "Prix";
    if (sort === "price-asc") return "Prix ↑";
    return "Prix ↓";
  };

  const cycleSort = () => {
    if (sort === "default") setSort("price-asc");
    else if (sort === "price-asc") setSort("price-desc");
    else setSort("default");
  };

  return (
    <section id="products" className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase font-medium mb-3">
          Nos Produits
        </p>
        <h2 className="font-display text-5xl md:text-6xl tracking-wider text-foreground">
          LA COLLECTION
        </h2>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-6" />
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors font-medium tracking-wide"
          />
        </div>
        <button
          onClick={cycleSort}
          className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 font-display tracking-wider text-sm whitespace-nowrap ${
            sort !== "default"
              ? "bg-primary text-primary-foreground border-primary glow-primary"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          <ArrowUpDown size={16} />
          {cycleSortLabel()}
        </button>
      </div>

      {/* Category filters */}
      <div className="flex justify-center gap-2 mb-12 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`font-display text-lg tracking-[0.15em] px-6 py-2.5 rounded-full border transition-all duration-300 ${
              active === cat
                ? "bg-primary text-primary-foreground border-primary glow-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg py-12">Aucun produit trouvé</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
