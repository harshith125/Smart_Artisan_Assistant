import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2 } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function AccountantDashboard() {
  const [productions, setProductions] = useState([]);
  
  useEffect(() => {
    const fetchProductions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/artisan/productions');
        setProductions(res.data);
      } catch (err) {
        console.error('Failed to fetch productions:', err);
      }
    };
    fetchProductions();
  }, []);

  const totalEarnings = productions.reduce((acc, curr) => {
    // extract number from ₹xxx or $xxx string, handling old mock data
    const priceString = curr.price || curr.earnings || '0';
    const val = parseInt(priceString.replace(/[^0-9]/g, ''), 10) || 0;
    return acc + val;
  }, 0);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}><BarChart2 size={30} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />Accountant Dashboard</h1>
          <p style={styles.subtitle}>Review all registered productions and platform revenue.</p>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Platform Revenue</p>
          <h2 style={styles.statValue}>₹{totalEarnings.toLocaleString('en-IN')}</h2>
        </div>

        <h3 style={styles.sectionTitle}>Registered Productions</h3>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Price</th>
              </tr>
            </thead>
            <tbody>
              {productions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No productions registered yet.
                  </td>
                </tr>
              ) : (
                productions.map((prod) => (
                  <tr key={prod.id} style={styles.tr}>
                    <td style={styles.td}><strong>{prod.id}</strong></td>
                    <td style={styles.td}>{prod.item}</td>
                    <td style={styles.td}>{prod.date}</td>
                    <td style={styles.td}><strong>{prod.price || prod.earnings || '₹0'}</strong></td>
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
    maxWidth: '1000px',
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
  statCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '3rem',
    textAlign: 'center'
  },
  statLabel: {
    color: '#10b981',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  statValue: {
    color: '#10b981',
    fontSize: '3rem',
    fontWeight: '700',
    margin: 0
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  tableContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
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
    backgroundColor: 'rgba(15, 23, 42, 0.4)'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
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
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: '#f59e0b'
  }
};
