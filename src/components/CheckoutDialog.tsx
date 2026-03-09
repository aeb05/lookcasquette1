import { useState, useRef, useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, Loader2, RefreshCw } from "lucide-react";
import apiClient from "@/lib/api";
import { checkoutSchema } from "@/lib/sanitize";

const RATE_LIMIT_MS = 60_000;

const generateCaptcha = () => {
  const ops = [
    () => {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      return { question: `${a} + ${b} = ?`, answer: a + b };
    },
    () => {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 10) + 1;
      return { question: `${a} - ${b} = ?`, answer: a - b };
    },
    () => {
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 10) + 2;
      return { question: `${a} × ${b} = ?`, answer: a * b };
    },
  ];
  return ops[Math.floor(Math.random() * ops.length)]();
};

const CheckoutDialog = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const lastSubmitRef = useRef<number>(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Captcha state
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  }, []);

  const startCooldown = () => {
    lastSubmitRef.current = Date.now();
    setCooldown(Math.ceil(RATE_LIMIT_MS / 1000));
    cooldownTimerRef.current = setInterval(() => {
      const remaining = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastSubmitRef.current)) / 1000);
      if (remaining <= 0) {
        setCooldown(0);
        if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      } else {
        setCooldown(remaining);
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setCaptchaError("");

    if (Date.now() - lastSubmitRef.current < RATE_LIMIT_MS) {
      toast.error(`Veuillez patienter ${cooldown}s avant de repasser commande`);
      return;
    }

    // Honeypot check
    if (honeypot) {
      // Silently reject — bot filled the hidden field
      toast.success("Commande confirmée !");
      return;
    }

    // Validate captcha
    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setCaptchaError("Réponse incorrecte. Réessayez.");
      refreshCaptcha();
      return;
    }

    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const sanitized = result.data;
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await apiClient.createOrder({
        customer_name: sanitized.name,
        customer_phone: sanitized.phone,
        customer_city: sanitized.city,
        customer_address: sanitized.address,
        items: orderItems,
        total: totalPrice,
      });

      toast.success("Commande confirmée ! Nous vous contacterons bientôt.");
      startCooldown();
      clearCart();
      setIsCheckoutOpen(false);
      setForm({ name: "", phone: "", city: "", address: "" });
      setCaptchaInput("");
      refreshCaptcha();
      setErrors({});
    } catch (err: any) {
      console.error("Order error:", err);
      if (err.message.includes('blacklist') || err.message.includes('bloqué')) {
        toast.error("Votre numéro est bloqué. Contactez le support.");
      } else {
        toast.error("Erreur lors de la commande. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={(open) => {
      setIsCheckoutOpen(open);
      if (open) refreshCaptcha();
    }}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground tracking-wide text-xl">
            Finaliser la commande
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-2">
          {items.length} article(s) — <span className="text-primary font-semibold">{totalPrice} MAD</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot — invisible to humans, bots will fill it */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-display text-sm">Nom complet *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Votre nom complet" className="bg-secondary border-border text-foreground" maxLength={100} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-display text-sm">Numéro de téléphone *</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="06XXXXXXXX" className="bg-secondary border-border text-foreground" maxLength={20} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-display text-sm">Ville *</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Votre ville" className="bg-secondary border-border text-foreground" maxLength={100} />
            {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-display text-sm">Adresse complète *</Label>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Votre adresse" className="bg-secondary border-border text-foreground" maxLength={300} />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          {/* CAPTCHA */}
          <div className="space-y-2 rounded-lg border border-border bg-secondary/50 p-3">
            <Label className="text-foreground font-display text-sm">Vérification anti-spam *</Label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary font-mono tracking-wider select-none">
                {captcha.question}
              </span>
              <button
                type="button"
                onClick={refreshCaptcha}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="Nouveau calcul"
              >
                <RefreshCw size={14} />
              </button>
            </div>
            <Input
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Votre réponse"
              className="bg-background border-border text-foreground"
              maxLength={10}
              inputMode="numeric"
            />
            {captchaError && <p className="text-xs text-destructive">{captchaError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-display font-bold tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            {loading ? "Envoi en cours..." : cooldown > 0 ? `Patienter ${cooldown}s` : "Confirmer la commande"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
