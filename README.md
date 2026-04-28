# Skill Hub

AI Skills 社区平台 - 浏览、发现和分享 AI 技能。

## 功能

- 浏览和发现 Skills（首页热榜/推荐/上新、搜索、分类筛选）
- Skill 详情和安装指引（对话安装/命令行安装、一键复制）
- 用户注册登录和个人中心
- Skill 提交与审核管理

## 技术栈

- **后端**: Node.js + Express + TypeScript + Sequelize
- **前端**: React 18 + TypeScript + Vite
- **数据库**: MySQL 8.0+

## 环境要求

- Node.js 18+
- MySQL 8.0+

## 快速开始

### 1. 配置数据库

创建 MySQL 数据库：

```sql
CREATE DATABASE skill_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 配置环境变量

```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，填写数据库密码等配置
```

### 3. 安装依赖

```bash
# 后端
cd backend && npm install

# 前端
cd frontend && npm install
```

### 4. 初始化数据

```bash
cd backend && npm run seed
```

这会创建：
- 管理员账号：`admin@skillhub.com` / `admin123`
- 演示用户：`demo@skillhub.com` / `user123`
- 6 个默认分类
- 8 个示例 Skill

### 5. 启动服务

```bash
# 后端（端口 5172）
cd backend && npm run dev

# 前端（端口 5173）
cd frontend && npm run dev
```

访问 http://localhost:5173 即可使用。

## 项目结构

```
backend/           # 后端 API
├── src/
│   ├── config/    # 配置（数据库、环境变量）
│   ├── models/    # 数据模型（User, Skill, Category, Review）
│   ├── routes/    # API 路由
│   ├── services/  # 业务逻辑
│   ├── middleware/ # 中间件（认证、上传、错误处理）
│   ├── utils/     # 工具函数
│   └── app.ts     # 入口文件

frontend/          # 前端 SPA
├── src/
│   ├── components/ # 通用组件
│   ├── pages/      # 页面
│   ├── services/   # API 调用
│   ├── contexts/   # React Context
│   └── hooks/      # 自定义 Hooks
```
