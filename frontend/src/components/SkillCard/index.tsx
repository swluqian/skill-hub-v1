import React from 'react';
import { Link } from 'react-router-dom';
import { Skill } from '../../types';
import './styles.css';

interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link to={`/skills/${skill.id}`} className="skill-card">
      <div className="skill-card-header">
        <div className="skill-icon">
          {skill.icon_url ? (
            <img src={skill.icon_url} alt={skill.name} />
          ) : (
            <span className="skill-icon-placeholder">
              {skill.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="skill-info">
          <h3 className="skill-name">{skill.name}</h3>
          <span className="skill-version">v{skill.version}</span>
        </div>
      </div>
      <p className="skill-desc">{skill.description}</p>
      <div className="skill-card-footer">
        <span className="skill-category">{skill.category?.name || '未分类'}</span>
        <span className="skill-downloads">
          <span className="download-icon">↓</span>
          {skill.download_count.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
