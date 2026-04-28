import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CopyButton from '../../components/CopyButton';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { Skill } from '../../types';
import { getSkillById } from '../../services/skills';
import './styles.css';

export default function SkillDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'command' | 'zip'>('command');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getSkillById(parseInt(id, 10))
      .then(setSkill)
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Skill 不存在');
        } else {
          setError('加载失败');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">加载中...</div>;
  if (error) {
    return (
      <div className="error-page">
        <h2>404</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">返回首页</button>
      </div>
    );
  }
  if (!skill) return null;

  return (
    <div className="skill-detail">
      <div className="detail-inner">
        <div className="detail-header">
          <div className="detail-icon">
            {skill.icon_url ? (
              <img src={skill.icon_url} alt={skill.name} />
            ) : (
              <span className="icon-placeholder">{skill.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="detail-info">
            <h1 className="detail-name">{skill.name}</h1>
            <div className="detail-meta">
              <span className="meta-item">v{skill.version}</span>
              <span className="meta-item">by {skill.author?.nickname || '未知'}</span>
              <span className="meta-item">{skill.category?.name}</span>
              <span className="meta-item">↓ {skill.download_count.toLocaleString()}</span>
            </div>
            <p className="detail-desc">{skill.description}</p>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-main">
            <section className="install-section">
              <h2>安装方式</h2>
              <div className="install-tabs">
                <button
                  className={`install-tab ${activeTab === 'command' ? 'active' : ''}`}
                  onClick={() => setActiveTab('command')}
                >
                  命令行安装
                </button>
                {skill.install_zip_url && (
                  <button
                    className={`install-tab ${activeTab === 'zip' ? 'active' : ''}`}
                    onClick={() => setActiveTab('zip')}
                  >
                    zip 包安装
                  </button>
                )}
              </div>
              <div className="install-content">
                {activeTab === 'command' ? (
                  <div className="install-block">
                    <pre className="install-code">{skill.install_command || '暂无命令行安装指引'}</pre>
                    {skill.install_command && <CopyButton text={skill.install_command} label="复制命令" />}
                  </div>
                ) : (
                  <div className="install-block">
                    <p className="install-zip-desc">下载 zip 包后，按照使用说明进行安装。</p>
                    <a
                      href={`/api/skills/${skill.id}/download`}
                      className="btn btn-primary"
                      download
                    >
                      下载 zip 包
                    </a>
                  </div>
                )}
              </div>
            </section>

            {skill.content && (
              <section className="readme-section">
                <h2>使用说明</h2>
                <MarkdownRenderer content={skill.content} />
              </section>
            )}
          </div>

          <aside className="detail-sidebar">
            <div className="sidebar-card">
              <h3>信息</h3>
              <dl className="info-list">
                <dt>版本</dt>
                <dd>{skill.version}</dd>
                <dt>分类</dt>
                <dd>{skill.category?.name || '未分类'}</dd>
                <dt>作者</dt>
                <dd>{skill.author?.nickname || '未知'}</dd>
                <dt>下载量</dt>
                <dd>{skill.download_count.toLocaleString()}</dd>
                <dt>更新时间</dt>
                <dd>{new Date(skill.updatedAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</dd>
                <dt>创建时间</dt>
                <dd>{new Date(skill.createdAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</dd>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
