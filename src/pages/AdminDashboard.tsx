import { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Package, RefreshCw, Clock, CheckCircle2, XCircle, Loader2, Search, ShoppingBag, Plus, Pencil, Trash2, X, Save, Home, BarChart3, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUploader } from "@/components/admin/ImageUploader";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import BlacklistTab from "@/components/admin/BlacklistTab";
import { productSchema, sanitizeText } from "@/lib/sanitize";

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  items: any[];
  total_price: number;
  status: string;
  created_at: string;
};

type DBProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  details: string[];
};

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  pending: { label: "En attente", icon: Clock, className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmed: { label: "Confirmée", icon: CheckCircle2, className: "bg-green-500/20 text-green-400 border-green-500/30" },
  cancelled: { label: "Annulée", icon: XCircle, className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const emptyProduct: Omit<DBProduct, "id"> = {
  name: "",
  price: 0,
  category: "",
  image: "",
  images: [],
  description: "",
  details: [],
};

const AdminDashboard = () => {
  const [blockingPhone, setBlockingPhone] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Product editing state
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailInput, setDetailInput] = useState("");
  const editFormRef = useRef<HTMLDivElement>(null);


  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getOrders();
      setOrders((data as Order[]) || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await apiClient.getProducts();
      setProducts((data as any[])?.map(p => ({ ...p, price: Number(p.price) })) || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des produits");
    }
    setProductsLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiClient.getSession();
        fetchOrders();
        fetchProducts();
      } catch (error) {
        navigate("/admin/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await apiClient.request(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(`Commande ${statusConfig[newStatus]?.label.toLowerCase() || newStatus}`);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
    setUpdatingId(null);
  };

  const handleLogout = async () => {
    await apiClient.logout();
    navigate("/admin/login");
  };

  const blockPhone = async (phone: string) => {
    if (!confirm(`Bloquer le numéro ${phone} ?`)) return;
    setBlockingPhone(phone);
    try {
      await apiClient.request('/blacklist', {
        method: 'POST',
        body: JSON.stringify({ type: 'phone', value: phone, reason: 'Bloqué depuis commande' }),
      });
      toast.success(`📵 ${phone} bloqué avec succès`);
    } catch (error: any) {
      if (error.message.includes('already')) {
        toast.info("Ce numéro est déjà bloqué");
      } else {
        toast.error("Erreur lors du blocage");
      }
    }
    setBlockingPhone(null);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Product CRUD
  const startNewProduct = () => {
    setEditingProduct({ id: "", ...emptyProduct });
    setIsNewProduct(true);
    setDetailInput("");
    setTimeout(() => editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const startEditProduct = (p: DBProduct) => {
    setEditingProduct({ ...p });
    setIsNewProduct(false);
    setDetailInput("");
    setTimeout(() => editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setIsNewProduct(false);
  };

  const saveProduct = async () => {
    if (!editingProduct) return;

    const result = productSchema.safeParse({
      ...editingProduct,
      images: editingProduct.images.length > 0 ? editingProduct.images : [editingProduct.image],
    });

    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Données invalides";
      toast.error(firstError);
      return;
    }

    setSavingProduct(true);
    const payload = {
      name: result.data.name,
      price: result.data.price,
      category: result.data.category,
      image: result.data.image,
      images: result.data.images,
      description: result.data.description,
      details: result.data.details,
    };

    try {
      if (isNewProduct) {
        await apiClient.createProduct(payload);
        toast.success("Produit créé !");
      } else {
        await apiClient.updateProduct(editingProduct.id, payload);
        toast.success("Produit mis à jour !");
      }
      setEditingProduct(null);
      setIsNewProduct(false);
      fetchProducts();
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      toast.error(isNewProduct ? "Erreur lors de la création" : "Erreur lors de la mise à jour");
    }
    setSavingProduct(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    setDeletingId(id);
    try {
      await apiClient.deleteProduct(id);
      toast.success("Produit supprimé");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
    setDeletingId(null);
  };

  const updateField = (field: keyof DBProduct, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const addDetail = () => {
    if (!detailInput.trim() || !editingProduct) return;
    const sanitized = sanitizeText(detailInput);
    if (!sanitized) return;
    updateField("details", [...editingProduct.details, sanitized]);
    setDetailInput("");
  };

  const removeDetail = (i: number) => {
    if (!editingProduct) return;
    updateField("details", editingProduct.details.filter((_, idx) => idx !== i));
  };


  const removeImage = (i: number) => {
    if (!editingProduct) return;
    updateField("images", editingProduct.images.filter((_, idx) => idx !== i));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={20} className="text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground tracking-wide">
              Admin
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-secondary">
              <Home size={16} />
              Accueil
            </button>
            <button onClick={() => { fetchOrders(); fetchProducts(); }} className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <RefreshCw size={18} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-secondary">
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders">
          <TabsList className="mb-6">
            <TabsTrigger value="orders" className="gap-2">
              <Package size={16} /> Commandes
              <Badge variant="outline" className="ml-1 text-xs">{orders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <ShoppingBag size={16} /> Produits
              <Badge variant="outline" className="ml-1 text-xs">{products.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 size={16} /> Analytiques
            </TabsTrigger>
            <TabsTrigger value="blacklist" className="gap-2">
              <Shield size={16} /> Blocage
            </TabsTrigger>
          </TabsList>

          {/* ===== ORDERS TAB ===== */}
          <TabsContent value="orders">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher par nom..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "all", label: "Toutes" },
                  { value: "pending", label: "En attente" },
                  { value: "confirmed", label: "Confirmées" },
                  { value: "cancelled", label: "Annulées" },
                ].map((s) => (
                  <button key={s.value} onClick={() => setStatusFilter(s.value)}
                    className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${statusFilter === s.value ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-secondary"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">Aucune commande trouvée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <div key={order.id} className="bg-card border border-border rounded-lg p-5">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-display font-bold text-foreground text-lg">{order.customer_name}</h3>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.className}`}>
                              <StatusIcon size={12} />{config.label}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>📞 {order.customer_phone}</p>
                            <p>📍 {order.customer_city} — {order.customer_address}</p>
                            <p className="text-xs">{new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(order.items as any[]).map((item: any, i: number) => (
                              <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{item.name} × {item.quantity}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <span className="font-display text-xl font-bold text-primary">{order.total_price} MAD</span>
                          <div className="flex gap-2">
                            {order.status !== "confirmed" && (
                              <button onClick={() => updateStatus(order.id, "confirmed")} disabled={updatingId === order.id}
                                className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-md hover:bg-green-500/30 transition-colors disabled:opacity-50">Confirmer</button>
                            )}
                            {order.status !== "cancelled" && (
                              <button onClick={() => updateStatus(order.id, "cancelled")} disabled={updatingId === order.id}
                                className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-md hover:bg-red-500/30 transition-colors disabled:opacity-50">Annuler</button>
                            )}
                            {order.status !== "pending" && (
                              <button onClick={() => updateStatus(order.id, "pending")} disabled={updatingId === order.id}
                                className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-md hover:bg-yellow-500/30 transition-colors disabled:opacity-50">En attente</button>
                            )}
                            <button
                              onClick={() => blockPhone(order.customer_phone)}
                              disabled={blockingPhone === order.customer_phone}
                              className="text-xs bg-destructive/20 text-destructive border border-destructive/30 px-3 py-1.5 rounded-md hover:bg-destructive/30 transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                              <Shield size={12} />
                              {blockingPhone === order.customer_phone ? "..." : "Bloquer"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ===== PRODUCTS TAB ===== */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">{products.length} produit(s)</p>
              <button onClick={startNewProduct}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-display tracking-wider text-sm hover:bg-primary-glow transition-colors">
                <Plus size={16} /> NOUVEAU PRODUIT
              </button>
            </div>

            {/* Edit / New product form */}
            {editingProduct && (
              <div ref={editFormRef} className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg tracking-wider text-foreground">
                    {isNewProduct ? "NOUVEAU PRODUIT" : "MODIFIER LE PRODUIT"}
                  </h3>
                  <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Nom *</label>
                    <Input value={editingProduct.name} onChange={(e) => updateField("name", e.target.value)} placeholder="NIKE NOIR" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Catégorie *</label>
                    <Input value={editingProduct.category} onChange={(e) => updateField("category", e.target.value)} placeholder="NIKE" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Prix (MAD) *</label>
                    <Input type="number" value={editingProduct.price} onChange={(e) => updateField("price", Number(e.target.value))} />
                  </div>
                  <div>
                    <ImageUploader
                      label="Image principale *"
                      value={editingProduct.image}
                      onChange={(url) => updateField("image", url)}
                      onRemove={() => updateField("image", "")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Description du produit..."
                  />
                </div>

                {/* Images gallery */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Images supplémentaires</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {editingProduct.images.map((img, i) => (
                      <ImageUploader
                        key={i}
                        label=""
                        value={img}
                        onChange={(url) => {
                          const newImages = [...editingProduct.images];
                          newImages[i] = url;
                          updateField("images", newImages);
                        }}
                        onRemove={() => removeImage(i)}
                        compact
                      />
                    ))}
                    <ImageUploader
                      label=""
                      value=""
                      onChange={(url) => updateField("images", [...editingProduct.images, url])}
                      compact
                    />
                  </div>
                </div>

                {/* Details */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Caractéristiques</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {editingProduct.details.map((d, i) => (
                      <div key={i} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                        {d}
                        <button onClick={() => removeDetail(i)}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={detailInput} onChange={(e) => setDetailInput(e.target.value)} placeholder="Ex: Tissu coton premium" className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDetail())} />
                    <button onClick={addDetail} className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">Ajouter</button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={cancelEdit} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Annuler</button>
                  <button onClick={saveProduct} disabled={savingProduct}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg font-display tracking-wider text-sm hover:bg-primary-glow transition-colors disabled:opacity-50">
                    {savingProduct ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isNewProduct ? "CRÉER" : "ENREGISTRER"}
                  </button>
                </div>
              </div>
            )}

            {productsLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">Aucun produit</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="aspect-square bg-secondary/30">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-display font-bold text-foreground tracking-wide">{p.name}</h4>
                          <p className="text-xs text-muted-foreground">{p.category}</p>
                        </div>
                        <span className="font-display text-primary font-bold">{p.price} MAD</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => startEditProduct(p)}
                          className="flex-1 flex items-center justify-center gap-1 text-xs bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-secondary/80 transition-colors">
                          <Pencil size={12} /> Modifier
                        </button>
                        <button onClick={() => deleteProduct(p.id)} disabled={deletingId === p.id}
                          className="flex items-center justify-center gap-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-md hover:bg-red-500/30 transition-colors disabled:opacity-50">
                          {deletingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== ANALYTICS TAB ===== */}
          <TabsContent value="analytics">
            <AnalyticsTab orders={orders as any} products={products as any} />
          </TabsContent>

          {/* ===== BLACKLIST TAB ===== */}
          <TabsContent value="blacklist">
            <BlacklistTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
