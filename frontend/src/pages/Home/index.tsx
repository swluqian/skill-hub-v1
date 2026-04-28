import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillCard from '../../components/SkillCard';
import SearchBar from '../../components/SearchBar';
import { Skill } from '../../types';
import { getHotSkills, getRecommendedSkills, getLatestSkills } from '../../services/skills';
import './styles.css';

export default function Home() {
  const navigate = useNavigate();
  const [hot, setHot] = useState<Skill[]>([]);
  const [recommended, setRecommended] = useState<Skill[]>([]);
  const [latest, setLatest] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getHotSkills(), getRecommendedSkills(), getLatestSkills()])
      .then(([h, r, l]) => {
        setHot(h);
        setRecommended(r);
        setLatest(l);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalCount = React.useMemo(() => {
    const ids = new Set<number>();
    hot.forEach((s) => ids.add(s.id));
    recommended.forEach((s) => ids.add(s.id));
    latest.forEach((s) => ids.add(s.id));
    return ids.size;
  }, [hot, recommended, latest]);

  const handleSearch = (keyword: string) => {
    navigate(`/explore?search=${encodeURIComponent(keyword)}`);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            发现和安装 <span className="highlight">AI Skills</span>
          </h1>
          <p className="hero-subtitle">
            浏览精选 AI 技能，一键安装，解锁 AI 超能力
          </p>
          <div className="hero-search">
            <SearchBar onSearch={handleSearch} placeholder="搜索你需要的 Skill..." />
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{totalCount}+</span>
              <span className="stat-label">Skills</span>
            </div>
          </div>
        </div>
      </section>

      {hot.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">🔥 下载热榜</h2>
              <button className="view-all" onClick={() => navigate('/explore?sort=downloads')}>
                查看全部 →
              </button>
            </div>
            <div className="skill-grid">
              {hot.slice(0, 6).map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">💡 为你推荐</h2>
              <button className="view-all" onClick={() => navigate('/explore')}>
                查看全部 →
              </button>
            </div>
            <div className="skill-grid">
              {recommended.slice(0, 6).map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <div className="section-header">
              <h2 className="section-title">🆕 最近上新</h2>
              <button className="view-all" onClick={() => navigate('/explore')}>
                查看全部 →
              </button>
            </div>
            <div className="skill-grid">
              {latest.slice(0, 6).map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        </section>
      )}

      {hot.length === 0 && recommended.length === 0 && latest.length === 0 && (
        <section className="section">
          <div className="section-inner empty-state">
            <p>暂无 Skills，快来提交第一个吧！</p>
          </div>
        </section>
      )}
    </div>
  );
}
