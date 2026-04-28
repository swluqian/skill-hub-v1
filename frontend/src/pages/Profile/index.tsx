import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Skill, PaginationInfo } from '../../types';
import { getUserSkills, updateProfile, changePassword } from '../../services/users';
import { deleteSkill } from '../../services/skills';
import './styles.css';

export default function Profile() {
  const { user, setAuth, token } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setNickname(user.nickname);
    setBio(user.bio || '');
    getUserSkills().then((r) => setSkills(r.data)).catch(console.error);
  }, [user]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确认删除 "${name}"？此操作不可撤销。`)) return;
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || '删除失败');
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('请填写所有字段');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('新密码与确认密码不一致');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('新密码长度不能少于 6 位');
      return;
    }
    setChangingPwd(true);
    try {
      await changePassword(oldPassword, newPassword);
      alert('密码修改成功');
      setShowPasswordForm(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || '修改失败');
    } finally {
      setChangingPwd(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nickname', nickname);
      formData.append('bio', bio);
      const updated = await updateProfile(formData);
      setAuth(updated, token!);
      setEditing(false);
    } catch (err: any) {
      alert(err.response?.data?.error || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: '待审核', className: 'status-pending' },
    approved: { label: '已发布', className: 'status-approved' },
    rejected: { label: '已拒绝', className: 'status-rejected' },
    superseded: { label: '已取代', className: 'status-superseded' },
  };

  return (
    <div className="profile-page">
      <div className="profile-inner">
        <div className="profile-card">
          <div className="profile-avatar">
            {user.avatar_url ? <img src={user.avatar_url} alt="" /> : user.nickname.charAt(0).toUpperCase()}
          </div>
          {editing ? (
            <div className="profile-edit">
              <div className="form-group"><label>昵称</label><input value={nickname} onChange={(e) => setNickname(e.target.value)} /></div>
              <div className="form-group"><label>简介</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} /></div>
              <div className="edit-actions">
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存'}</button>
                <button className="btn btn-ghost" onClick={() => setEditing(false)}>取消</button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <h2>{user.nickname}</h2>
              <p className="profile-email">{user.email}</p>
              <p className="profile-bio">{user.bio || '暂无简介'}</p>
              <div className="profile-actions">
                <button className="btn btn-ghost" onClick={() => setEditing(true)}>编辑资料</button>
                <button className="btn btn-ghost" onClick={() => setShowPasswordForm(true)}>修改密码</button>
              </div>
            </div>
          )}
        </div>

        <div className="my-skills">
          <h3>我提交的 Skills ({skills.length})</h3>
          {skills.length > 0 ? (
            <div className="skills-table">
              <table>
                <thead><tr><th>名称</th><th>版本</th><th>状态</th><th>拒绝原因</th><th>时间</th><th>操作</th></tr></thead>
                <tbody>
                  {skills.map((s) => (
                    <tr key={s.id}>
                      <td style={{ cursor: s.status === 'approved' ? 'pointer' : 'default' }} onClick={() => s.status === 'approved' && navigate(`/skills/${s.id}`)}>{s.name}</td>
                      <td>v{s.version}</td>
                      <td><span className={`status-badge ${statusMap[s.status].className}`}>{statusMap[s.status].label}</span></td>
                      <td className="reject-reason">{s.reject_reason || '-'}</td>
                      <td>{new Date(s.createdAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</td>
                      <td className="action-cell">
                        <button className="btn-edit" onClick={() => navigate(`/skills/${s.id}/edit`)}>编辑</button>
                        <button className="btn-delete" onClick={() => handleDelete(s.id, s.name)}>删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-text">暂无提交的 Skill</p>
          )}
        </div>

        {showPasswordForm && (
          <div className="modal-overlay" onClick={() => setShowPasswordForm(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>修改密码</h3>
              {passwordError && <div className="auth-error">{passwordError}</div>}
              <div className="form-group"><label>旧密码</label><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} /></div>
              <div className="form-group"><label>新密码</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
              <div className="form-group"><label>确认密码</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={handleChangePassword} disabled={changingPwd}>{changingPwd ? '修改中...' : '确认修改'}</button>
                <button className="btn btn-ghost" onClick={() => setShowPasswordForm(false)}>取消</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
