import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState(null);

  const roles = [
    {
      id: 'admin',
      title: 'Administrator',
      desc: 'Manage users, analytics, and platform settings',
      path: '/admin/dashboard',
      color: '#8b5cf6',
      icon: '🛡️'
    },
    {
      id: 'accountant',
      title: 'Accountant',
      desc: 'Handle payments, billing, and financial reports',
      path: '/accountant/dashboard',
      color: '#10b981',
      icon: '📊'
    },
    {
      id: 'artisan',
      title: 'Artisan',
      desc: 'Manage productions, AI assistant, and tasks',
      path: '/artisan/dashboard',
      color: '#f59e0b',
      icon: '🎨'
    }
  ];

  const handleLogin = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      
      <div style={styles.glassCard}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Select your role to access the dashboard</p>
        
        <div style={styles.rolesGrid}>
          {roles.map((role) => (
            <div
              key={role.id}
              style={{
                ...styles.roleCard,
                ...(hoveredRole === role.id ? styles.roleCardHover : {}),
                borderColor: hoveredRole === role.id ? role.color : 'rgba(255,255,255,0.1)',
                transform: hoveredRole === role.id ? 'translateY(-5px)' : 'none',
              }}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleLogin(role.path)}
            >
              <div style={{ ...styles.iconWrapper, backgroundColor: `${role.color}20`, color: role.color }}>
                {role.icon}
              </div>
              <h3 style={styles.roleTitle}>{role.title}</h3>
              <p style={styles.roleDesc}>{role.desc}</p>
              
              <button style={{
                ...styles.loginBtn,
                backgroundColor: hoveredRole === role.id ? role.color : 'rgba(255,255,255,0.05)',
                color: hoveredRole === role.id ? '#fff' : '#aaa'
              }}>
                Enter Dashboard &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    margin: 0,
    padding: '2rem',
    boxSizing: 'border-box'
  },
  blob1: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '50vw',
    height: '50vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(15,23,42,0) 70%)',
    filter: 'blur(60px)',
    zIndex: 1
  },
  blob2: {
    position: 'absolute',
    bottom: '-20%',
    right: '-10%',
    width: '60vw',
    height: '60vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(15,23,42,0) 70%)',
    filter: 'blur(60px)',
    zIndex: 1
  },
  glassCard: {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '3rem',
    maxWidth: '1000px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    textAlign: 'center'
  },
  title: {
    color: '#ffffff',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1.1rem',
    marginBottom: '3rem'
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem'
  },
  roleCard: {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '2rem',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    marginBottom: '1.5rem',
    transition: 'transform 0.3s ease'
  },
  roleTitle: {
    color: '#f8fafc',
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.75rem'
  },
  roleDesc: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '2rem',
    flexGrow: 1
  },
  loginBtn: {
    width: '100%',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }
};

export default Login;
