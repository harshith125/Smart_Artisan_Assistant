import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';

export default function AddProduction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [form, setForm] = useState({
    itemName: '',
    category: 'Woodwork',
    description: '',
    materials: '',
    estimatedTime: '',
    basePrice: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await axios.post('http://localhost:5000/api/artisan/productions', form);
      
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/artisan/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error adding production:', err);
      setError('Failed to add production. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/artisan/dashboard')}>
            &larr; Back to Dashboard
          </button>
          <h1 style={styles.title}>Add New Production</h1>
          <p style={styles.subtitle}>Enter the details of your new handcrafted item below.</p>
        </div>

        <div style={styles.card}>
          {success ? (
            <div style={styles.successState}>
              <div style={styles.successIcon}><CheckCircle size={56} color="#10b981" /></div>
              <h2>Production Added Successfully!</h2>
              <p>Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              {error && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
                  {error}
                </div>
              )}
              <div style={styles.grid}>
                
                {/* Item Name */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Item Name</label>
                  <input 
                    name="itemName"
                    type="text"
                    required
                    value={form.itemName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="e.g. Handcrafted Oak Table"
                  />
                </div>

                {/* Category */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select 
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="Woodwork">Woodwork</option>
                    <option value="Pottery">Pottery & Ceramics</option>
                    <option value="Leather">Leather Goods</option>
                    <option value="Textiles">Textiles & Weaving</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Base Price */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Base Price (INR)</label>
                  <input 
                    name="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.basePrice}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="e.g. 1500.00"
                  />
                </div>
              </div>

              {/* Materials */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Materials Required</label>
                <input 
                  name="materials"
                  type="text"
                  required
                  value={form.materials}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g. Solid Oak, Varnish, Wood Glue"
                />
              </div>

              {/* Description */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description</label>
                <textarea 
                  name="description"
                  required
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  style={{...styles.input, resize: 'vertical'}}
                  placeholder="Describe the production process and final product..."
                />
              </div>

              <div style={styles.footer}>
                <button 
                  type="submit" 
                  style={styles.submitBtn} 
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Production'}
                </button>
              </div>
            </form>
          )}
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
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.2s',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1rem',
    margin: 0
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
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
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#f8fafc',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  footer: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  submitBtn: {
    padding: '0.875rem 2rem',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)'
  },
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '3rem 0',
    color: '#10b981'
  },
  successIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  }
};
