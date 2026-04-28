import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Category } from '../../types';
import { createSkill, getCategories } from '../../services/skills';
import './styles.css';

export default function SubmitSkill() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', content: '', version: '1.0.0', install_command: '', category_id: '' });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getCategories().then(setCategories).catch(console.error);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.description || !form.version || !form.category_id) {
      setError('请填写名称、描述、版本和分类');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (iconFile) formData.append('icon', iconFile);
      if (zipFile) formData.append('zipFile', zipFile);
      await createSkill(formData);
      alert('提交成功，等待审核');
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.error || '提交失败');
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="submit-page">
      <div className="submit-inner">
        <h1>提交 Skill</h1>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-row">
            <div className="form-group"><label>名称 *</label><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Skill 名称" /></div>
            <div className="form-group"><label>版本 *</label><input value={form.version} onChange={(e) => update('version', e.target.value)} placeholder="1.0.0" /></div>
          </div>
          <div className="form-group"><label>分类 *</label>
            <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)}>
              <option value="">请选择分类</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group"><label>简介 *</label><textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} placeholder="简要描述 Skill 的功能" /></div>
          <div className="form-group"><label>使用说明 (Markdown)</label><textarea value={form.content} onChange={(e) => update('content', e.target.value)} rows={8} placeholder="详细的使用说明，支持 Markdown" /></div>
          <div className="form-group"><label>命令行安装指引</label><textarea value={form.install_command} onChange={(e) => update('install_command', e.target.value)} rows={3} placeholder="命令行安装命令" /></div>
          <div className="form-group"><label>zip 包</label><input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files?.[0] || null)} /><small>仅支持 .zip 格式，最大 50MB</small></div>
          <div className="form-group"><label>图标</label><input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files?.[0] || null)} /></div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? '提交中...' : '提交 Skill'}</button>
        </form>
      </div>
    </div>
  );
}
