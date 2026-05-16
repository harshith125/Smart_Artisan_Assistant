import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function Reports() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/artisan/productions');
        setProductions(res.data);
      } catch (err) {
        console.error('Failed to fetch productions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductions();
  }, []);

  // Calculate statistics
  const totalItems = productions.length;
  const totalValue = productions.reduce((acc, curr) => {
    return acc + (parseInt(curr.price.replace(/[^0-9]/g, ''), 10) || 0);
  }, 0);
  
  const avgPrice = totalItems > 0 ? Math.round(totalValue / totalItems) : 0;

  // Group by category
  const categoryStats = productions.reduce((acc, curr) => {
    const cat = curr.category || 'General';
    if (!acc[cat]) acc[cat] = { count: 0, value: 0, items: [] };
    acc[cat].count += 1;
    acc[cat].value += (parseInt(curr.price.replace(/[^0-9]/g, ''), 10) || 0);
    acc[cat].items.push(curr.item);
    return acc;
  }, {});

  // Find most valuable category
  let topCategory = 'None';
  let topCategoryValue = 0;
  Object.entries(categoryStats).forEach(([cat, stats]) => {
    if (stats.value > topCategoryValue) {
      topCategoryValue = stats.value;
      topCategory = cat;
    }
  });

  // Material frequency analysis
  const materialCounts = {};
  productions.forEach(p => {
    if (p.materials) {
      const mats = p.materials.split(',').map(m => m.trim().toLowerCase()).filter(m => m);
      mats.forEach(m => {
        materialCounts[m] = (materialCounts[m] || 0) + 1;
      });
    }
  });
  
  const topMaterials = Object.entries(materialCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}><TrendingUp size={30} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />Production Reports</h1>
          <p style={styles.subtitle}>A breakdown of your handcrafted output, value generation, and material usage.</p>
        </div>

        {loading ? (
          <div style={styles.loading}>Generating report data...</div>
        ) : (
          <>
            {/* Top Overview Cards */}
            <div style={styles.overviewGrid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Output</p>
                <h2 style={styles.statValue}>{totalItems} Items</h2>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Value Created</p>
                <h2 style={{ ...styles.statValue, color: '#10b981' }}>₹{totalValue.toLocaleString('en-IN')}</h2>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Average Item Price</p>
                <h2 style={{ ...styles.statValue, color: '#8b5cf6' }}>₹{avgPrice.toLocaleString('en-IN')}</h2>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Top Category</p>
                <h2 style={{ ...styles.statValue, color: '#f59e0b', fontSize: '1.8rem', marginTop: '0.5rem' }}>
                  {topCategory}
                </h2>
              </div>
            </div>

            <div style={styles.splitLayout}>
              {/* Left Column: Categories */}
              <div style={styles.mainSection}>
                <h3 style={styles.sectionTitle}>Breakdown by Category</h3>
                <div style={styles.grid}>
                  {Object.keys(categoryStats).length === 0 ? (
                    <p style={styles.emptyState}>No data available to generate categories.</p>
                  ) : (
                    Object.entries(categoryStats).map(([category, stats]) => (
                      <div key={category} style={styles.categoryCard}>
                        <h4 style={styles.catTitle}>{category}</h4>
                        <div style={styles.catStatsRow}>
                          <div style={styles.catStat}>
                            <span style={styles.catStatLabel}>Items</span>
                            <span style={styles.catStatValue}>{stats.count}</span>
                          </div>
                          <div style={styles.catStat}>
                            <span style={styles.catStatLabel}>Value</span>
                            <span style={{ ...styles.catStatValue, color: '#10b981' }}>
                              ₹{stats.value.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Internal List of Items */}
                        <div style={styles.categoryItemListContainer}>
                          <p style={styles.categoryItemListTitle}>Items in this category:</p>
                          <ul style={styles.categoryItemList}>
                            {stats.items.map((itemName, idx) => (
                              <li key={idx} style={styles.categoryItemListItem}>
                                <span style={styles.categoryItemDot}>•</span> {itemName}
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Materials */}
              <div style={styles.sideSection}>
                <h3 style={styles.sectionTitle}>Most Used Materials</h3>
                <div style={styles.materialCard}>
                  {topMaterials.length === 0 ? (
                    <p style={styles.emptyState}>No materials logged yet.</p>
                  ) : (
                    <ul style={styles.materialList}>
                      {topMaterials.map(([mat, count], idx) => (
                        <li key={idx} style={styles.materialItem}>
                          <span style={styles.materialName}>{mat}</span>
                          <span style={styles.materialCount}>used in {count} items</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2.5rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1.1rem',
    margin: 0
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: '#94a3b8',
    fontSize: '1.1rem'
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  statCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
  },
  statLabel: {
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  statValue: {
    color: '#f8fafc',
    fontSize: '2.2rem',
    fontWeight: '700',
    margin: 0
  },
  splitLayout: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap'
  },
  mainSection: {
    flex: '2 1 500px'
  },
  sideSection: {
    flex: '1 1 300px'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  categoryCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '1.25rem',
  },
  catTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    color: '#e2e8f0'
  },
  catStatsRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  catStat: {
    display: 'flex',
    flexDirection: 'column',
  },
  catStatLabel: {
    color: '#64748b',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem'
  },
  catStatValue: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#f8fafc'
  },
  categoryItemListContainer: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  categoryItemListTitle: {
    fontSize: '0.75rem',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 0.5rem 0'
  },
  categoryItemList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  categoryItemListItem: {
    fontSize: '0.9rem',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  categoryItemDot: {
    color: '#8b5cf6',
    fontSize: '1.2rem',
    lineHeight: '0.5'
  },
  materialCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '1.25rem',
  },
  materialList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  materialItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  materialName: {
    color: '#f8fafc',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  materialCount: {
    color: '#94a3b8',
    fontSize: '0.85rem'
  },
  emptyState: {
    color: '#64748b',
    fontStyle: 'italic',
  }
};
