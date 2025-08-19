import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login(form.email, form.password);
        console.log(res)
      nav('/chat');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" value={form.email}
               onChange={(e)=>setForm({...form, email:e.target.value})} />
        <input type="password" placeholder="Password" value={form.password}
               onChange={(e)=>setForm({...form, password:e.target.value})} />
        <button>Login</button>
      </form>
      {err && <p className="error">{err}</p>}
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}