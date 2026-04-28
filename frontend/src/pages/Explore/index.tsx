import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SkillCard from '../../components/SkillCard';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import Pagination from '../../components/Pagination';
import { Skill, Category, PaginationInfo } from '../../types';
import { getSkills, getCategories } from '../../services/skills';
import './styles.css';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, pageSize: 12, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!, 10) : null;
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getSkills({
      page,
      pageSize: 12,
      search: search || undefined,
      categoryId: categoryId || undefined,
      sort: sort || undefined,
    })
      .then((result) => {
        setSkills(result.data);
        setPagination(result.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, categoryId, sort, page]);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    setSearchParams(params);
  };

  return (
    <div className="explore">
      <div className="explore-inner">
        <div className="explore-header">
          <h1>探索 Skills</h1>
          <SearchBar
            defaultValue={search}
            onSearch={(keyword) => updateParams({ search: keyword, page: '1' })}
          />
        </div>

        <div className="explore-filters">
          <CategoryFilter
            categories={categories}
            activeId={categoryId}
            onChange={(id) => updateParams({ categoryId: id?.toString() || null, page: '1' })}
          />
          <div className="sort-options">
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value || null, page: '1' })}
              className="sort-select"
            >
              <option value="">最新</option>
              <option value="downloads">最热</option>
              <option value="name">名称</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">加载中...</div>
        ) : skills.length > 0 ? (
          <>
            <div className="skill-grid">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
            <Pagination
              pagination={pagination}
              onChange={(p) => updateParams({ page: p.toString() })}
            />
          </>
        ) : (
          <div className="empty-state">
            <p>未找到相关 Skill</p>
            {search && <p className="empty-hint">试试其他关键词？</p>}
          </div>
        )}
      </div>
    </div>
  );
}
