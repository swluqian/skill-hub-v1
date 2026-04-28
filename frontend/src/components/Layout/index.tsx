import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Skill Hub</span>
          </Link>
          <nav className="nav">
            <Link to="/explore" className="nav-link">探索</Link>
            {user && (
              <Link to="/submit" className="nav-link">提交 Skill</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link">管理后台</Link>
            )}
          </nav>
          <div className="header-actions">
            {user ? (
              <div className="user-menu">
                <Link to="/profile" className="user-info">
                  <span className="user-avatar">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.nickname} />
                    ) : (
                      user.nickname.charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="user-name">{user.nickname}</span>
                </Link>
                <button onClick={handleLogout} className="btn-logout">退出</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-ghost">登录</Link>
                <Link to="/register" className="btn btn-primary">注册</Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <div className="footer-inner">
          <p>© 2026 Skill Hub - AI Skills 社区平台</p>
        </div>
      </footer>
    </div>
  );
}
