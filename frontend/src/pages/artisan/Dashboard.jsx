import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function ArtisanDashboard() {
  const navigate = useNavigate();
  let user = { name: 'Artisan' };
  try {
    const stored = localStorage.getItem('user');
    if (stored && stored !== 'undefined') user = JSON.parse(stored) || user;
  } catch (e) {}

  // State to trigger re-renders
  const [productions, setProductions] = React.useState([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('productions');
    if (saved) {
      // Migrate old data on the fly (change $ to ₹, change earnings to price)
      let parsed = JSON.parse(saved);
      let needsUpdate = false;
      parsed = parsed.map(p => {
        let updatedP = { ...p };
        if (updatedP.earnings) {
          updatedP.price = updatedP.earnings;
          delete updatedP.earnings;
          needsUpdate = true;
        }
        if (updatedP.price && updatedP.price.includes('$')) {
          // Scale it up so it looks right in INR
          const num = parseInt(updatedP.price.replace(/[^0-9]/g, ''), 10);
          updatedP.price = `₹${num * 10}`; 
          needsUpdate = true;
        }
        return updatedP;
      });
      
      if (needsUpdate) {
        localStorage.setItem('productions', JSON.stringify(parsed));
      }
      setProductions(parsed);
    } else {
      const defaults = [
        { id: 'PRD-001', item: 'Handcrafted Wooden Chair', date: '2026-05-15', price: '₹2500' },
        { id: 'PRD-002', item: 'Ceramic Vase Set', date: '2026-05-14', price: '₹800' },
        { id: 'PRD-003', item: 'Leather Wallet', date: '2026-05-12', price: '₹1200' },
        { id: 'PRD-004', item: 'Knitted Wool Scarf', date: '2026-05-10', price: '₹600' }
      ];
      localStorage.setItem('productions', JSON.stringify(defaults));
      setProductions(defaults);
    }
  }, []);

  // Calculate dynamic stats
  const totalProductions = productions.length;
  const totalEarnings = productions.reduce((acc, curr) => {
    // Handle both new 'price' and old 'earnings' properties from cached local storage
    const priceString = curr.price || curr.earnings || '0';
    const val = parseInt(priceString.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + val;
  }, 0);

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        {/* Welcome Section */}
        <div style={styles.header}>
          <h1 style={styles.welcomeText}>Welcome back, {user.name}! 👋</h1>
          <p style={styles.subtitle}>Here is what's happening with your productions today.</p>
        </div>

        {/* 2 Summary Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIconWrapper}>📦</div>
            <div>
              <p style={styles.statLabel}>Total Productions</p>
              <h2 style={styles.statValue}>{totalProductions}</h2>
            </div>
          </div>
          <div style={{ ...styles.statCard, borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <div style={{ ...styles.statIconWrapper, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>💰</div>
            <div>
              <p style={styles.statLabel}>Total Value Created</p>
              <h2 style={styles.statValue}>₹{totalEarnings.toLocaleString('en-IN')}</h2>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <button style={styles.actionBtn} onClick={() => navigate('/artisan/add-production')}>
            <span style={styles.actionIcon}>➕</span> Add Production
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/artisan/ai-assistant')}>
            <span style={styles.actionIcon}>🤖</span> AI Assistant
          </button>
          <button style={styles.actionBtn} onClick={() => navigate('/artisan/reports')}>
            <span style={styles.actionIcon}>📊</span> View Reports
          </button>
        </div>

        {/* Recent Productions Table */}
        <h3 style={styles.sectionTitle}>Recent Productions</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>Date Added</th>
                <th style={styles.th}>Price</th>
              </tr>
            </thead>
            <tbody>
              {productions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No productions added yet. Click "Add Production" to get started!
                  </td>
                </tr>
              ) : (
                productions.map((prod) => (
                  <tr key={prod.id} style={styles.tr}>
                    <td style={styles.td}><strong>{prod.id}</strong></td>
                    <td style={styles.td}>{prod.item}</td>
                    <td style={styles.td}>{prod.date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981'
                      }}>
                        {prod.price || prod.earnings || '₹0'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
  welcomeText: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1.1rem',
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
    alignItems: 'center',
    gap: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
  },
  statIconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    color: '#8b5cf6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem'
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    margin: '0 0 0.25rem 0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: 0
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    marginTop: '2rem'
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '3rem'
  },
  actionBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '1rem',
    color: '#f8fafc',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  actionIcon: {
    fontSize: '1.25rem'
  },
  tableContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: 'rgba(15, 23, 42, 0.4)'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    transition: 'background-color 0.2s ease'
  },
  td: {
    padding: '1.25rem 1.5rem',
    fontSize: '0.95rem'
  },
  badge: {
    padding: '0.35rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'inline-block'
  },
  completeBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};

export default ArtisanDashboard;
