import { useEffect, useState } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { Shield, Trash2, Plus, Loader2, Phone, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type BlacklistEntry = {
  id: string;
  type: "phone" | "ip";
  value: string;
  reason: string;
  created_at: string;
};

const BlacklistTab = () => {
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newType, setNewType] = useState<"phone" | "ip">("phone");
  const [newValue, setNewValue] = useState("");
  const [newReason, setNewReason] = useState("");

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await apiClient.request('/blacklist');
      setEntries((data as BlacklistEntry[]) || []);
    } catch (error) {
      toast.error("Erreur lors du chargement de la liste noire");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const addEntry = async () => {
    const trimmed = newValue.trim();
    if (!trimmed) {
      toast.error("Veuillez entrer une valeur");
      return;
    }
    setAdding(true);
    try {
      await apiClient.request('/blacklist', {
        method: 'POST',
        body: JSON.stringify({ type: newType, value: trimmed, reason: newReason.trim() }),
      });
      toast.success("Entrée ajoutée à la liste noire");
      setNewValue("");
      setNewReason("");
      fetchEntries();
    } catch (error: any) {
      if (error.message.includes('already') || error.message.includes('409')) {
        toast.error("Cette entrée existe déjà");
      } else {
        toast.error("Erreur lors de l'ajout");
      }
    }
    setAdding(false);
  };

  const removeEntry = async (id: string) => {
    setDeletingId(id);
    try {
      await apiClient.request(`/blacklist/${id}`, { method: 'DELETE' });
      toast.success("Entrée supprimée");
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="font-display text-lg tracking-wider text-foreground flex items-center gap-2">
          <Shield size={18} className="text-primary" /> Ajouter au blocage
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setNewType("phone")}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border transition-colors ${
              newType === "phone"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            <Phone size={14} /> Téléphone
          </button>
          <button
            onClick={() => setNewType("ip")}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border transition-colors ${
              newType === "ip"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            <Globe size={14} /> Adresse IP
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={newType === "phone" ? "06XXXXXXXX" : "123.456.789.0"}
            className="sm:col-span-1"
          />
          <Input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Raison (optionnel)"
            className="sm:col-span-1"
          />
          <button
            onClick={addEntry}
            disabled={adding}
            className="flex items-center justify-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-display text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Bloquer
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <Shield size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Aucune entrée dans la liste noire</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Badge
                  variant="outline"
                  className={
                    entry.type === "phone"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                  }
                >
                  {entry.type === "phone" ? <Phone size={12} className="mr-1" /> : <Globe size={12} className="mr-1" />}
                  {entry.type === "phone" ? "Tél" : "IP"}
                </Badge>
                <span className="font-mono text-foreground text-sm truncate">{entry.value}</span>
                {entry.reason && (
                  <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                    — {entry.reason}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {new Date(entry.created_at).toLocaleDateString("fr-FR")}
                </span>
                <button
                  onClick={() => removeEntry(entry.id)}
                  disabled={deletingId === entry.id}
                  className="p-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  {deletingId === entry.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlacklistTab;
