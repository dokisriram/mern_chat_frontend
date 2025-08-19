import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({email:'', password:'' });
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(form.name, form.email, form.password);
      nav('/chat');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth">
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" value={form.email}
               onChange={(e)=>setForm({...form, email:e.target.value})} />
        <input type="password" placeholder="Password" value={form.password}
               onChange={(e)=>setForm({...form, password:e.target.value})} />
        <button>Create account</button>
      </form>
      {err && <p className="error">{err}</p>}
      <p>Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}