import { useEffect } from "react";
import supabase from "./supabase-client";

function Dashboard() {
  const fetchMetrics = async () => {
    const response = await supabase.from("sales_deals").select(
      `
    name,
    value.sum()
    `,
    );
    console.log(response);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);
  return (
    <div className="dashbaord-wrapper">
      <div className="chart-containter">
        <h2>Total Sales This Quarter ($)</h2>
      </div>
    </div>
  );
}
export default Dashboard;
