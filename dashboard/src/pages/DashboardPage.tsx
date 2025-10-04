import { useState, useEffect, useMemo } from 'react';
import { Package, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import KPICard from '../components/Dashboard/KPICard';
import FilterBar from '../components/Dashboard/FilterBar';
import Charts from '../components/Dashboard/Charts';
import InventoryTable from '../components/Dashboard/InventoryTable';
import { InventoryItem, InventoryFilters, InventoryKPIs, AgeingBucket, ExpiryRisk } from '../types';
import apiService from '../lib/api';

export default function DashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [kpis, setKpis] = useState<InventoryKPIs | null>(null);
  const [uniqueParts, setUniqueParts] = useState<{ jwl_parts: string[]; customer_parts: string[] }>({ jwl_parts: [], customer_parts: [] });
  const [filters, setFilters] = useState<InventoryFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadInventory();
  }, [filters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [kpisData, uniquePartsData] = await Promise.all([
        apiService.getDashboardKPIs(),
        apiService.getUniqueParts()
      ]);
      
      setKpis(kpisData);
      setUniqueParts(uniquePartsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const response = await apiService.getInventory(filters);
      setInventory(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory data');
      console.error('Error loading inventory:', err);
    }
  };

  const ageingBuckets = useMemo(() => {
    if (!kpis) return [];
    
    return [
      { label: '0-30 days', count: kpis.ageing_buckets['0-30'], qty: 0 },
      { label: '30-60 days', count: kpis.ageing_buckets['30-60'], qty: 0 },
      { label: '60+ days', count: kpis.ageing_buckets['60+'], qty: 0 },
    ];
  }, [kpis]);

  const expiryRisks = useMemo(() => {
    if (!kpis) return [];
    
    const total = kpis.total_items || 1;
    
    return [
      {
        category: '<30 days',
        count: kpis.expiry_risk.high,
        percentage: Math.round((kpis.expiry_risk.high / total) * 100),
      },
      {
        category: '30-90 days',
        count: kpis.expiry_risk.medium,
        percentage: Math.round((kpis.expiry_risk.medium / total) * 100),
      },
      {
        category: '>90 days',
        count: kpis.expiry_risk.low,
        percentage: Math.round((kpis.expiry_risk.low / total) * 100),
      },
    ];
  }, [kpis]);

  const trendData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => ({
      month,
      qty: Math.floor(Math.random() * 500) + 300 + idx * 50,
    }));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2]"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error Loading Dashboard</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button 
              onClick={loadDashboardData}
              className="px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h2>
        <p className="text-gray-600 mt-1">Monitor inventory ageing and expiry status</p>
      </div>

      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <KPICard
            title="Total Stock Cases"
            value={kpis.total_stock.toLocaleString()}
            icon={Package}
            subtitle={`${kpis.total_items} items`}
            trend="up"
          />
          <KPICard
            title="Near Expiry"
            value={`${kpis.percent_near_expiry}%`}
            icon={AlertTriangle}
            subtitle="< 30 days remaining"
            color={kpis.percent_near_expiry > 20 ? 'text-red-600' : 'text-[#1976D2]'}
          />
          <KPICard
            title="Average Ageing"
            value={`${kpis.average_ageing} days`}
            icon={Clock}
            subtitle="Since manufacturing"
          />
          <KPICard
            title="Total Items"
            value={kpis.total_items}
            icon={TrendingUp}
            subtitle="In inventory"
          />
        </div>
      )}

      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        jwlParts={uniqueParts.jwl_parts}
        customerParts={uniqueParts.customer_parts}
      />

      <Charts
        ageingBuckets={ageingBuckets}
        expiryRisks={expiryRisks}
        trendData={trendData}
      />

      <InventoryTable data={inventory} />
    </Layout>
  );
}
