import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Skill, Review } from '../../types';
import { getPendingSkills, approveSkill, rejectSkill, getReviews, getAllUsers, changeUserPassword, getAdminSkillList } from '../../services/users';
import { deleteSkill } from '../../services/skills';
import './styles.css';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState<Skill[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState<'pending' | 'history' | 'users' | 'skills'>('pending');
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [adminSkills, setAdminSkills] = useState<Skill[]>([]);
  const [adminSkillsTotal, setAdminSkillsTotal] = useState(0);
  const [adminSkillsPage, setAdminSkillsPage] = useState(1);
  const [viewingSkill, setViewingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadData();
  }, [user]);

  const loadData = () => {
    getPendingSkills().then(setPending).catch(console.error);
    getReviews().then(setReviews).catch(console.error);
  };

  const loadUsers = () => {
    getAllUsers().then(setUsers).catch(console.error);
  };

  const handleResetPassword = async () => {
    if (!resetPassword || resetPassword.length < 6) {
      setResetError('密码长度不能少于 6 位');
      return;
    }
    if (!resetUserId) return;
    try {
      await changeUserPassword(resetUserId, resetPassword);
      alert('密码修改成功');
      setResetUserId(null);
      setResetPassword('');
      setResetError('');
    } catch (err: any) {
      setResetError(err.response?.data?.error || '修改失败');
    }
  };

  const loadAdminSkills = (page: number = 1) => {
    setAdminSkillsPage(page);
    getAdminSkillList({ page, pageSize: 10 }).then((r) => {
      setAdminSkills(r.data);
      setAdminSkillsTotal(r.pagination.total);
    }).catch(console.error);
  };

  const handleApprove = async (id: number) => {
    if (!confirm('确认通过审核？')) return;
    await approveSkill(id);
    loadData();
  };

  const handleReject = async () => {
    if (!rejectId) { alert('无效的 Skill ID'); return; }
    if (!reason.trim()) { alert('请填写拒绝原因'); return; }
    if (reason.length > 500) { alert('拒绝原因不能超过 500 字'); return; }
    await rejectSkill(rejectId, reason);
    setRejectId(null);
    setReason('');
    loadData();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确认删除 "${name}"？此操作不可撤销。`)) return;
    try {
      await deleteSkill(id);
      if (tab === 'skills') {
        loadAdminSkills(adminSkillsPage);
      } else {
        loadData();
      }
    } catch (err: any) {
      alert(err.response?.data?.error || '删除失败');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-inner">
        <h1>管理后台</h1>
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>待审核 ({pending.length})</button>
          <button className={`admin-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>审核记录</button>
          <button className={`admin-tab ${tab === 'skills' ? 'active' : ''}`} onClick={() => { setTab('skills'); loadAdminSkills(1); }}>Skill 管理</button>
          <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => { setTab('users'); loadUsers(); }}>用户管理</button>
        </div>

        {tab === 'pending' && (
          <div className="admin-content">
            {pending.length === 0 ? <p className="empty-text">暂无待审核 Skill</p> : (
              <div className="skills-table"><table>
                <thead><tr><th>名称</th><th>分类</th><th>作者</th><th>版本</th><th>提交时间</th><th>操作</th></tr></thead>
                <tbody>{pending.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{(s as any).category?.name || '-'}</td>
                    <td>{(s as any).author?.nickname || '-'}</td>
                    <td>v{s.version}</td>
                    <td>{new Date(s.createdAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</td>
                    <td className="action-cell">
                      <button className="btn-view" onClick={() => setViewingSkill(s)}>查看</button>
                      <button className="btn-approve" onClick={() => handleApprove(s.id)}>通过</button>
                      <button className="btn-reject" onClick={() => { setRejectId(s.id); setReason(''); }}>拒绝</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table></div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="admin-content">
            {reviews.length === 0 ? <p className="empty-text">暂无审核记录</p> : (
              <div className="skills-table"><table>
                <thead><tr><th>Skill名称</th><th>版本</th><th>作者</th><th>分类</th><th>审核人</th><th>结果</th><th>原因</th><th>时间</th></tr></thead>
                <tbody>{reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{(r.skill as any)?.name || '-'}</td>
                    <td>{(r.skill as any)?.version ? `v${(r.skill as any).version}` : '-'}</td>
                    <td>{(r.skill as any)?.author?.nickname || '-'}</td>
                    <td>{(r.skill as any)?.category?.name || '-'}</td>
                    <td>{r.reviewer?.nickname || '-'}</td>
                    <td><span className={`status-badge ${r.action === 'approve' ? 'status-approved' : 'status-rejected'}`}>{r.action === 'approve' ? '通过' : '拒绝'}</span></td>
                    <td className="reject-reason">{r.reason || '-'}</td>
                    <td>{new Date(r.createdAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</td>
                  </tr>
                ))}</tbody>
              </table></div>
            )}
          </div>
        )}

        {tab === 'skills' && (
          <div className="admin-content">
            {adminSkills.length === 0 ? <p className="empty-text">暂无 Skill</p> : (
              <>
                <div className="skills-table"><table>
                  <thead><tr><th>名称</th><th>作者</th><th>版本</th><th>状态</th><th>时间</th><th>操作</th></tr></thead>
                  <tbody>{adminSkills.map((s) => (
                    <tr key={s.id}>
                      <td>{(s as any).author?.nickname || '-'}</td>
                      <td>{s.name}</td>
                      <td>v{s.version}</td>
                      <td><span className={`status-badge ${s.status === 'approved' ? 'status-approved' : s.status === 'pending' ? 'status-pending' : 'status-rejected'}`}>
                        {s.status === 'approved' ? '已发布' : s.status === 'pending' ? '待审核' : '已拒绝'}
                      </span></td>
                      <td>{new Date(s.createdAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</td>
                      <td className="action-cell">
                        <button className="btn-edit" onClick={() => navigate(`/skills/${s.id}/edit`)}>编辑</button>
                        <button className="btn-delete" onClick={() => handleDelete(s.id, s.name)}>删除</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table></div>
                <div className="pagination">
                  <button disabled={adminSkillsPage <= 1} onClick={() => loadAdminSkills(adminSkillsPage - 1)}>上一页</button>
                  <span>第 {adminSkillsPage} / {Math.ceil(adminSkillsTotal / 10)} 页，共 {adminSkillsTotal} 条</span>
                  <button disabled={adminSkillsPage >= Math.ceil(adminSkillsTotal / 10)} onClick={() => loadAdminSkills(adminSkillsPage + 1)}>下一页</button>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div className="admin-content">
            {users.length === 0 ? <p className="empty-text">暂无用户</p> : (
              <div className="skills-table"><table>
                <thead><tr><th>ID</th><th>邮箱</th><th>昵称</th><th>角色</th><th>注册时间</th><th>操作</th></tr></thead>
                <tbody>{users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.nickname || '-'}</td>
                    <td><span className={`status-badge ${u.role === 'admin' ? 'status-approved' : 'status-pending'}`}>{u.role === 'admin' ? '管理员' : '普通用户'}</span></td>
                    <td>{new Date(u.created_at).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</td>
                    <td className="action-cell">
                      <button className="btn-edit" onClick={() => { setResetUserId(u.id); setResetPassword(''); setResetError(''); }}>重置密码</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table></div>
            )}
          </div>
        )}

        {rejectId && (
          <div className="modal-overlay" onClick={() => setRejectId(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>拒绝原因</h3>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="请填写拒绝原因（必填，最多500字）"
                maxLength={500}
              />
              <div className="reason-counter">{reason.length}/500</div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handleReject}>确认拒绝</button>
                <button className="btn btn-ghost" onClick={() => setRejectId(null)}>取消</button>
              </div>
            </div>
          </div>
        )}

        {resetUserId && (
          <div className="modal-overlay" onClick={() => setResetUserId(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>重置密码</h3>
              {resetError && <div className="auth-error">{resetError}</div>}
              <div className="form-group"><label>新密码</label><input type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="请输入新密码（至少6位）" /></div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handleResetPassword}>确认修改</button>
                <button className="btn btn-ghost" onClick={() => setResetUserId(null)}>取消</button>
              </div>
            </div>
          </div>
        )}

        {viewingSkill && (
          <div className="modal-overlay" onClick={() => setViewingSkill(null)}>
            <div className="modal skill-detail-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Skill 详情</h3>
              <div className="skill-detail-content">
                <div className="skill-detail-header">
                  <div className="skill-detail-icon">
                    {(viewingSkill as any).icon_url ? (
                      <img src={(viewingSkill as any).icon_url} alt={viewingSkill.name} className="skill-detail-icon-img" />
                    ) : (
                      <span className="skill-detail-icon-placeholder">{viewingSkill.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="skill-detail-basic">
                    <h2>{viewingSkill.name}</h2>
                    <div className="skill-detail-meta">
                      <span>v{viewingSkill.version}</span>
                      <span>{(viewingSkill as any).category?.name || '未分类'}</span>
                      <span>{(viewingSkill as any).author?.nickname || '未知'}</span>
                    </div>
                  </div>
                </div>

                <div className="skill-detail-section">
                  <h3>基本信息</h3>
                  <div className="skill-detail-row">
                    <span className="skill-detail-label">名称</span>
                    <span className="skill-detail-value">{viewingSkill.name}</span>
                  </div>
                  <div className="skill-detail-row">
                    <span className="skill-detail-label">版本</span>
                    <span className="skill-detail-value">{viewingSkill.version}</span>
                  </div>
                  <div className="skill-detail-row">
                    <span className="skill-detail-label">分类</span>
                    <span className="skill-detail-value">{(viewingSkill as any).category?.name || '-'}</span>
                  </div>
                  <div className="skill-detail-row">
                    <span className="skill-detail-label">作者</span>
                    <span className="skill-detail-value">{(viewingSkill as any).author?.nickname || '-'}</span>
                  </div>
                  <div className="skill-detail-row">
                    <span className="skill-detail-label">简介</span>
                    <span className="skill-detail-value">{viewingSkill.description || '-'}</span>
                  </div>
                </div>

                <div className="skill-detail-section">
                  <h3>安装信息</h3>
                  <div className="skill-detail-row">
                    <span className="skill-detail-label">命令行</span>
                    <span className="skill-detail-value">{viewingSkill.install_command || '-'}</span>
                  </div>
                  <div className="skill-detail-row">
                    <span className="skill-detail-label">zip 包</span>
                    <span className="skill-detail-value">
                      {viewingSkill.install_zip_url ? (
                        <a href={`/api/skills/${viewingSkill.id}/download`} target="_blank" rel="noopener noreferrer" className="download-link">点击下载 zip 包</a>
                      ) : '暂无'}
                    </span>
                  </div>
                </div>

                <div className="skill-detail-section">
                  <h3>使用说明</h3>
                  <div className="skill-detail-value content">{viewingSkill.content || '暂无'}</div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setViewingSkill(null)}>关闭</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
