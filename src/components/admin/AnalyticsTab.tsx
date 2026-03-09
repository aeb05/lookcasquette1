import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  BarChart3,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

type Order = {
  id: string;
  customer_name: string;
  customer_city: string;
  items: any[];
  total_price: number;
  status: string;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

interface AnalyticsTabProps {
  orders: Order[];
  products: Product[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "hsl(42, 100%, 50%)",
  confirmed: "hsl(142, 71%, 45%)",
  cancelled: "hsl(0, 72%, 51%)",
};

const CHART_COLORS = [
  "hsl(42, 100%, 50%)",
  "hsl(200, 80%, 50%)",
  "hsl(280, 70%, 55%)",
  "hsl(142, 71%, 45%)",
  "hsl(20, 90%, 55%)",
  "hsl(330, 70%, 55%)",
];

const AnalyticsTab = ({ orders, products }: AnalyticsTabProps) => {
  const stats = useMemo(() => {
    const confirmed = orders.filter((o) => o.status === "confirmed");
    const pending = orders.filter((o) => o.status === "pending");
    const cancelled = orders.filter((o) => o.status === "cancelled");
    const totalRevenue = confirmed.reduce((s, o) => s + o.total_price, 0);
    const avgOrder = confirmed.length > 0 ? totalRevenue / confirmed.length : 0;

    return {
      totalOrders: orders.length,
      confirmedCount: confirmed.length,
      pendingCount: pending.length,
      cancelledCount: cancelled.length,
      totalRevenue,
      avgOrder,
    };
  }, [orders]);

  // Orders by status for pie chart
  const statusData = useMemo(
    () => [
      { name: "Confirmées", value: stats.confirmedCount, color: STATUS_COLORS.confirmed },
      { name: "En attente", value: stats.pendingCount, color: STATUS_COLORS.pending },
      { name: "Annulées", value: stats.cancelledCount, color: STATUS_COLORS.cancelled },
    ],
    [stats]
  );

  // Revenue over last 7 days
  const revenueByDay = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
      days[key] = 0;
    }

    orders
      .filter((o) => o.status === "confirmed")
      .forEach((o) => {
        const d = new Date(o.created_at);
        const key = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
        if (key in days) days[key] += o.total_price;
      });

    return Object.entries(days).map(([date, revenue]) => ({ date, revenue }));
  }, [orders]);

  // Top products by quantity sold
  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders
      .filter((o) => o.status === "confirmed")
      .forEach((o) => {
        (o.items as any[]).forEach((item: any) => {
          const key = item.name || item.id;
          if (!counts[key]) counts[key] = { name: key, qty: 0, revenue: 0 };
          counts[key].qty += item.quantity || 1;
          counts[key].revenue += (item.price || 0) * (item.quantity || 1);
        });
      });
    return Object.values(counts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 6);
  }, [orders]);

  // Orders by city
  const cityData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      const city = o.customer_city || "Inconnu";
      counts[city] = (counts[city] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([city, count]) => ({ city, count }));
  }, [orders]);

  const kpis = [
    {
      label: "Revenu total",
      value: `${stats.totalRevenue.toLocaleString()} MAD`,
      icon: DollarSign,
      accent: "text-primary",
    },
    {
      label: "Commandes",
      value: stats.totalOrders,
      icon: ShoppingCart,
      accent: "text-primary",
    },
    {
      label: "Confirmées",
      value: stats.confirmedCount,
      icon: CheckCircle2,
      accent: "text-green-400",
    },
    {
      label: "En attente",
      value: stats.pendingCount,
      icon: Clock,
      accent: "text-yellow-400",
    },
    {
      label: "Annulées",
      value: stats.cancelledCount,
      icon: XCircle,
      accent: "text-red-400",
    },
    {
      label: "Panier moyen",
      value: `${Math.round(stats.avgOrder).toLocaleString()} MAD`,
      icon: TrendingUp,
      accent: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-4 flex flex-col items-center text-center gap-1">
              <kpi.icon size={20} className={kpi.accent} />
              <span className="text-2xl font-display font-bold text-foreground">{kpi.value}</span>
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display tracking-wider text-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              REVENU (7 DERNIERS JOURS)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 7%)",
                      border: "1px solid hsl(0, 0%, 14%)",
                      borderRadius: "8px",
                      color: "hsl(40, 20%, 92%)",
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} MAD`, "Revenu"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(42, 100%, 50%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(42, 100%, 50%)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Pie Chart */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display tracking-wider text-foreground flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              RÉPARTITION DES COMMANDES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              {stats.totalOrders === 0 ? (
                <p className="text-muted-foreground text-sm">Aucune donnée</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 7%)",
                        border: "1px solid hsl(0, 0%, 14%)",
                        borderRadius: "8px",
                        color: "hsl(40, 20%, 92%)",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.name} ({s.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display tracking-wider text-foreground flex items-center gap-2">
              <Package size={16} className="text-primary" />
              TOP PRODUITS VENDUS
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">Aucune vente confirmée</p>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
                    <XAxis type="number" tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100}
                      tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 7%)",
                        border: "1px solid hsl(0, 0%, 14%)",
                        borderRadius: "8px",
                        color: "hsl(40, 20%, 92%)",
                        fontSize: 12,
                      }}
                      formatter={(value: number, name: string) => [
                        name === "qty" ? `${value} vendus` : `${value.toLocaleString()} MAD`,
                        name === "qty" ? "Quantité" : "Revenu",
                      ]}
                    />
                    <Bar dataKey="qty" fill="hsl(42, 100%, 50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders by City */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display tracking-wider text-foreground flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              COMMANDES PAR VILLE
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cityData.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">Aucune donnée</p>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 14%)" />
                    <XAxis dataKey="city" tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(0, 0%, 50%)", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 7%)",
                        border: "1px solid hsl(0, 0%, 14%)",
                        borderRadius: "8px",
                        color: "hsl(40, 20%, 92%)",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(200, 80%, 50%)" radius={[4, 4, 0, 0]} name="Commandes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
