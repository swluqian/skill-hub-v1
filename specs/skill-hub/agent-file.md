# Skill Hub Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-22

## Active Technologies

- **Backend**: Node.js 18+ / TypeScript 5.x / Express.js 4.x / Sequelize 6.x
- **Frontend**: React 18 / TypeScript 5.x / Vite 5.x / React Router 6.x
- **Database**: MySQL 8.0+
- **Auth**: JWT (jsonwebtoken) / bcryptjs
- **File Upload**: multer
- **HTTP Client**: axios
- **Markdown**: react-markdown

## Project Structure

```text
backend/
├── src/
│   ├── config/          # database.ts, env.ts
│   ├── models/          # user.ts, skill.ts, category.ts, review.ts, index.ts
│   ├── routes/          # auth.ts, skills.ts, categories.ts, users.ts, admin.ts
│   ├── middleware/      # auth.ts, admin.ts, error-handler.ts, upload.ts, validator.ts
│   ├── services/        # auth.service.ts, skill.service.ts, category.service.ts, user.service.ts, review.service.ts
│   ├── utils/           # jwt.ts, password.ts, pagination.ts
│   └── app.ts
├── uploads/
├── package.json
└── tsconfig.json

frontend/
├── src/
│   ├── components/      # Layout/, SkillCard/, SearchBar/, CategoryFilter/, Pagination/, CopyButton/, MarkdownRenderer/
│   ├── pages/           # Home/, Explore/, SkillDetail/, Login/, Register/, Profile/, SubmitSkill/, Admin/
│   ├── services/        # api.ts, auth.ts, skills.ts, users.ts
│   ├── hooks/           # useAuth.ts, useSkills.ts
│   ├── contexts/        # AuthContext.tsx
│   ├── types/           # index.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Commands

```bash
# Backend
cd backend && npm install          # 安装依赖
cd backend && npm run dev          # 开发模式启动（ts-node-dev）
cd backend && npm run build        # 编译 TypeScript
cd backend && npm start            # 生产模式启动

# Frontend
cd frontend && npm install         # 安装依赖
cd frontend && npm run dev         # 开发模式启动（Vite）
cd frontend && npm run build       # 生产构建
cd frontend && npm run preview     # 预览生产构建
```

## Code Style

### TypeScript (Backend & Frontend)
- 使用 ES Module 语法 (`import/export`)
- 文件命名：kebab-case（如 `skill.service.ts`）
- 组件命名：PascalCase（如 `SkillCard.tsx`）
- 接口/类型命名：PascalCase，接口不加 `I` 前缀
- 常量命名：UPPER_SNAKE_CASE
- 函数命名：camelCase
- 异步操作使用 async/await
- 错误处理使用 try/catch + 统一错误中间件

### React (Frontend)
- 使用函数组件 + Hooks
- 状态管理使用 React Context（不引入 Redux）
- 组件文件夹结构：`ComponentName/index.tsx` + `ComponentName/styles.css`

## Recent Changes

- 2026-04-22: 初始项目规划，创建完整规格文档

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
