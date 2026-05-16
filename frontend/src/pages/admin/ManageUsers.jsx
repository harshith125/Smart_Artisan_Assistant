import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/approve`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Approval failed', err);
      alert('Failed to approve user');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.title}>Manage Users & Approvals</h2>
          
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Identifier</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={styles.tr}>
                      <td style={styles.td}><strong>{u.name}</strong></td>
                      <td style={styles.td}>
                        <span style={{...styles.badge, backgroundColor: u.role === 'admin' ? '#8b5cf620' : '#f59e0b20', color: u.role === 'admin' ? '#8b5cf6' : '#f59e0b'}}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {u.artisanId || u.email}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge, 
                          backgroundColor: u.status === 'approved' ? '#10b98120' : '#ef444420',
                          color: u.status === 'approved' ? '#10b981' : '#ef4444'
                        }}>
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {u.status === 'pending' ? (
                          <button style={styles.approveBtn} onClick={() => handleApprove(u._id)}>
                            Approve
                          </button>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#0f172a',
    padding: '2rem',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    color: '#f8fafc'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  title: {
    marginBottom: '2rem',
    fontSize: '2rem',
    fontWeight: '700'
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    overflow: 'hidden'
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
    letterSpacing: '0.05em'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)'
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
  approveBtn: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};
