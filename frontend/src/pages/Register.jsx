import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', password: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [artisanId, setArtisanId] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setArtisanId('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setSuccess('Registration successful! Awaiting admin approval.');
      setArtisanId(res.data.artisanId);
      // Optional: don't auto-redirect so they can copy the ID, or redirect after 10 seconds.
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      
      <div style={styles.glassCard}>
        <div style={styles.iconWrapper}>🎨</div>
        <h1 style={styles.title}>Register as Artisan</h1>
        <p style={styles.subtitle}>Join the platform to manage your productions</p>
        
        {artisanId ? (
          <div style={styles.idContainer}>
            <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Your Artisan ID is:</p>
            <h2 style={styles.idText}>{artisanId}</h2>
            <p style={{ color: '#f59e0b', fontSize: '0.85rem', marginTop: '1rem' }}>Please save this ID safely. You will need it to log in.</p>
            <button onClick={() => navigate('/login')} style={styles.submitBtn}>
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                name="name" 
                type="text" 
                value={form.name} 
                onChange={handleChange} 
                style={styles.input}
                placeholder="John Doe"
                required 
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                style={styles.input}
                placeholder="••••••••"
                required 
              />
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}
            {success && <div style={styles.successMessage}>{success}</div>}
            
            <button type="submit" style={styles.submitBtn}>
              Create Account
            </button>
          </form>
        )}

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
        </p>
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
    background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(15,23,42,0) 70%)',
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
    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(15,23,42,0) 70%)',
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
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    textAlign: 'center'
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#f59e0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    margin: '0 auto 1.5rem auto'
  },
  title: {
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em'
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1rem',
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    textAlign: 'left'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    color: '#cbd5e1',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#f8fafc',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease'
  },
  successMessage: {
    padding: '0.75rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    fontSize: '0.9rem',
    textAlign: 'center',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  errorMessage: {
    padding: '0.75rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    fontSize: '0.9rem',
    textAlign: 'center',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  submitBtn: {
    width: '100%',
    padding: '0.875rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background-color 0.2s ease'
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    marginTop: '2rem'
  },
  link: {
    color: '#f59e0b',
    textDecoration: 'none',
    fontWeight: '500'
  },
  idContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px dashed rgba(245, 158, 11, 0.4)'
  },
  idText: {
    color: '#f8fafc',
    fontSize: '2.5rem',
    letterSpacing: '2px',
    margin: '0.5rem 0'
  }
};

export default Register;
