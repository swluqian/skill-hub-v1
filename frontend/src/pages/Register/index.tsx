import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { register } from '../../services/auth';
import './styles.css';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !nickname) {
      setError('请填写所有字段');
      return;
    }
    if (password.length < 6) {
      setError('密码长度至少6位');
      return;
    }
    setLoading(true);
    try {
      const result = await register(email, password, nickname);
      setAuth(result.user, result.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">注册</h1>
        <p className="auth-subtitle">加入 Skill Hub 社区</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>昵称</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="请输入昵称" />
          </div>
          <div className="form-group">
            <label>邮箱</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入邮箱" autoComplete="email" />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少6位" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <p className="auth-footer">已有账号？<Link to="/login">立即登录</Link></p>
      </div>
    </div>
  );
}
