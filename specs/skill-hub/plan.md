# Implementation Plan: Skill Hub

**Branch**: `001-skill-hub` | **Date**: 2026-04-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/skill-hub/spec.md`

## Summary

构建一个 Skill Hub 平台，提供 AI Skills 的浏览发现、详情展示与安装指引、用户提交与审核管理、用户注册登录与个人中心功能。采用前后端分离架构，后端使用 Node.js + Express + MySQL，前端使用 React + TypeScript。

## Technical Context

**Language/Version**: Node.js 18+ (后端), TypeScript 5.x (前后端)  
**Primary Dependencies**: Express.js (后端框架), React 18 (前端框架), Sequelize (ORM), Vite (前端构建)  
**Storage**: MySQL 8.0+  
**Testing**: Jest (单元测试), Supertest (API 测试)  
**Target Platform**: Web (现代浏览器)  
**Project Type**: Web Application (前后端分离)  
**Performance Goals**: 首页加载 < 3s, API 响应 < 1s, 支持 500 并发  
**Constraints**: 不使用 Docker, 不使用云存储, 本地文件系统存储上传文件  
**Scale/Scope**: 初期支持数千个 Skill 条目, 数百用户

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ 前后端分离，职责清晰
- ✅ 使用成熟稳定的技术栈（Express + React）
- ✅ 数据库使用 MySQL，符合用户要求
- ✅ 不使用 Docker，符合用户要求
- ✅ 简单直接的架构，无过度设计

## Project Structure

### Documentation (this feature)

```text
specs/skill-hub/
├── spec.md              # 功能规格文档
├── plan.md              # 本文件 - 实现计划
├── tasks.md             # 任务列表
├── checklist.md         # 检查清单
└── constitution.md      # 项目准则
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── config/          # 数据库配置、环境变量、常量
│   │   ├── database.ts
│   │   └── env.ts
│   ├── models/          # Sequelize 数据模型
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── skill.ts
│   │   ├── category.ts
│   │   ├── skill-version.ts
│   │   └── review.ts
│   ├── routes/          # Express 路由定义
│   │   ├── auth.ts
│   │   ├── skills.ts
│   │   ├── categories.ts
│   │   ├── users.ts
│   │   └── admin.ts
│   ├── middleware/      # 中间件（认证、错误处理、上传）
│   │   ├── auth.ts
│   │   ├── admin.ts
│   │   ├── error-handler.ts
│   │   ├── upload.ts
│   │   └── validator.ts
│   ├── services/        # 业务逻辑层
│   │   ├── auth.service.ts
│   │   ├── skill.service.ts
│   │   ├── category.service.ts
│   │   ├── user.service.ts
│   │   └── review.service.ts
│   ├── utils/           # 工具函数
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── pagination.ts
│   └── app.ts           # Express 应用入口
├── uploads/             # 上传文件存储目录
├── package.json
├── tsconfig.json
└── .env.example

frontend/
├── src/
│   ├── components/      # 通用组件
│   │   ├── Layout/
│   │   ├── SkillCard/
│   │   ├── SearchBar/
│   │   ├── CategoryFilter/
│   │   ├── Pagination/
│   │   ├── CopyButton/
│   │   └── MarkdownRenderer/
│   ├── pages/           # 页面组件
│   │   ├── Home/
│   │   ├── Explore/
│   │   ├── SkillDetail/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Profile/
│   │   ├── SubmitSkill/
│   │   └── Admin/
│   ├── services/        # API 调用封装
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── skills.ts
│   │   └── users.ts
│   ├── hooks/           # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   └── useSkills.ts
│   ├── contexts/        # React Context
│   │   └── AuthContext.tsx
│   ├── types/           # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/           # 前端工具函数
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── favicon.svg
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Structure Decision**: 采用 Web Application 前后端分离结构。后端 `backend/` 提供 RESTful API，前端 `frontend/` 为 React SPA。两者独立构建和运行，通过 API 通信。

## Complexity Tracking

无违规项，架构简单直接。

## API 设计概要

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### Skill 相关
- `GET /api/skills` - 获取 Skill 列表（支持搜索、分类筛选、分页、排序）
- `GET /api/skills/hot` - 获取下载热榜
- `GET /api/skills/recommended` - 获取推荐列表
- `GET /api/skills/latest` - 获取最近上新
- `GET /api/skills/:id` - 获取 Skill 详情
- `GET /api/skills/:id/download` - 下载 Skill zip 包，文件名使用 Skill 名称（如 `{skill名称}.zip`），下载量 +1
- `POST /api/skills` - 提交新 Skill（需认证，支持 zip 包上传）
- `PUT /api/skills/:id` - 更新 Skill（需认证，仅作者或管理员，支持 zip 包上传；更新已发布 Skill 时创建新版本（status=pending），新版本号必须大于当前版本号，原版本保持不变；更新 pending/rejected Skill 时直接更新原记录）
- `DELETE /api/skills/:id` - 删除 Skill（需认证，仅作者或管理员，永久删除）

### 分类相关
- `GET /api/categories` - 获取所有分类

### 用户相关
- `GET /api/users/profile` - 获取个人资料（需认证）
- `PUT /api/users/profile` - 更新个人资料（需认证）
- `PUT /api/users/password` - 修改当前用户密码（需认证，需提供旧密码验证）
- `GET /api/users/skills` - 获取用户提交的 Skill 列表（需认证）

### 管理员相关
- `GET /api/admin/skills/pending` - 获取待审核 Skill 列表（需管理员权限，返回完整信息：名称、描述、内容、版本、分类、作者、提交时间）
- `POST /api/admin/skills/:id/approve` - 通过审核（需管理员权限）
- `POST /api/admin/skills/:id/reject` - 拒绝审核（需管理员权限）
- `GET /api/admin/skills` - 获取所有 Skill 列表（需管理员权限，支持分页，用于 Skill 管理）
- `GET /api/admin/reviews` - 获取审核记录（需管理员权限，包含关联的 Skill 详情：名称、版本、描述、作者等）
- `GET /api/admin/users` - 获取所有用户列表（需管理员权限）
- `PUT /api/admin/users/:id/password` - 修改指定用户密码（需管理员权限，无需旧密码验证）

### 列表可见性策略
- 公开列表（`GET /api/skills` 及其热榜/推荐/最新子接口）：仅返回 `status='approved'` 的 Skill，且该 Skill 不能有 `superseded` 状态的父版本（即只显示最新批准版本）
- 提交者本人查看时：提交后处于 `pending`/`rejected` 状态的 Skill 仍在列表页和详情页可见（需在 Skill 数据中返回 `is_owner: true` 标识，供前端判断是否显示"待审核"/"更新中"状态标签）
- 管理员查看时：所有 Skill 均可见，包括 `pending`/`rejected`/`superseded` 状态的完整信息

### 版本分支策略
- Skill 状态枚举：`pending`（待审核）、`approved`（已发布）、`rejected`（已拒绝）、`superseded`（已被新版本取代）
- 当用户更新已发布的 Skill 时，系统复制原记录创建新版本（`parent_id` 指向原记录），新版本 `status='pending'`，原版本 `status` 保持 `approved` 不变
- 当管理员审核通过新版本时：新版本 `status='approved'`，原版本 `status` 变为 `superseded`（表示已被取代）
- 当管理员审核拒绝新版本时：新版本 `status='rejected'`，原版本保持不变
- 广场列表只显示 `status='approved'` 且没有被取代的版本（`superseded` 状态的版本不在广场显示）

## 数据模型概要

### User
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT, PK, AUTO_INCREMENT | 主键 |
| email | VARCHAR(255), UNIQUE | 邮箱 |
| password_hash | VARCHAR(255) | 密码哈希 |
| nickname | VARCHAR(100) | 昵称 |
| avatar_url | VARCHAR(500) | 头像 URL |
| bio | TEXT | 个人简介 |
| role | ENUM('user','admin') | 角色，默认 user |
| created_at | DATETIME | 注册时间 |
| updated_at | DATETIME | 更新时间 |

### Skill
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT, PK, AUTO_INCREMENT | 主键 |
| name | VARCHAR(200) | 名称 |
| description | TEXT | 简介 |
| content | LONGTEXT | 使用说明（Markdown） |
| version | VARCHAR(50) | 当前版本 |
| icon_url | VARCHAR(500) | 图标 URL |
| install_command | TEXT | 命令行安装指引 |
| install_zip_url | VARCHAR(500) | zip 包文件路径（本地存储，如 /uploads/xxx.zip） |
| download_count | INT, DEFAULT 0 | 下载量 |
| status | ENUM('pending','approved','rejected','superseded') | 审核状态 |
| is_recommended | BOOLEAN, DEFAULT false | 是否推荐 |
| author_id | INT, FK → User.id | 作者 |
| category_id | INT, FK → Category.id | 分类 |
| parent_id | INT, FK → Skill.id, NULL | 父版本 ID，为 NULL 表示是根版本 |
| reject_reason | TEXT | 拒绝原因 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### Category
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT, PK, AUTO_INCREMENT | 主键 |
| name | VARCHAR(100), UNIQUE | 分类名 |
| description | VARCHAR(500) | 描述 |
| sort_order | INT, DEFAULT 0 | 排序权重 |
| created_at | DATETIME | 创建时间 |

### Review
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT, PK, AUTO_INCREMENT | 主键 |
| skill_id | INT, FK → Skill.id | 关联 Skill（包含完整 Skill 详情：名称、版本、描述、作者等） |
| reviewer_id | INT, FK → User.id | 审核人 |
| action | ENUM('approve','reject') | 审核动作 |
| reason | TEXT | 拒绝原因 |
| created_at | DATETIME | 审核时间（年-月-日 时:分:秒） |
