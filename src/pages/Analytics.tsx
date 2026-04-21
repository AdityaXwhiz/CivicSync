import { useEffect, useState } from "react";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${BASE_URL}/analytics`);
        const json = await res.json();
        console.log("Analytics Data:", json);
        setData(json);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive data insights and statistics
        </p>
      </div>

      {loading ? (
        <div>Loading analytics...</div>
      ) : (
        <AnalyticsDashboard data={data} />
      )}
    </div>
  );
}