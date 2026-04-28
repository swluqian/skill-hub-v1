# Tasks: Skill Hub

**Input**: Design documents from `/specs/skill-hub/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: 未明确要求测试，任务中不包含测试任务。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 初始化后端项目，配置 `backend/package.json`、`backend/tsconfig.json`，安装 Express、Sequelize、mysql2、jsonwebtoken、bcryptjs、multer、cors 等依赖
- [ ] T002 [P] 初始化前端项目，使用 Vite + React + TypeScript 创建 `frontend/`，安装 react-router-dom、axios、react-markdown 等依赖
- [ ] T003 [P] 创建 `backend/.env.example` 和环境变量配置 `backend/src/config/env.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 配置数据库连接 `backend/src/config/database.ts`，使用 Sequelize 连接 MySQL
- [ ] T005 [P] 创建 User 模型 `backend/src/models/user.ts`
- [ ] T006 [P] 创建 Category 模型 `backend/src/models/category.ts`
- [ ] T007 [P] 创建 Skill 模型 `backend/src/models/skill.ts`（关联 User、Category）
- [ ] T008 [P] 创建 Review 模型 `backend/src/models/review.ts`（关联 Skill、User）
- [ ] T009 创建模型索引文件 `backend/src/models/index.ts`，定义模型关联关系
- [ ] T010 [P] 实现 JWT 工具 `backend/src/utils/jwt.ts` 和密码工具 `backend/src/utils/password.ts`
- [ ] T011 [P] 实现分页工具 `backend/src/utils/pagination.ts`
- [ ] T012 [P] 实现认证中间件 `backend/src/middleware/auth.ts` 和管理员中间件 `backend/src/middleware/admin.ts`
- [ ] T013 [P] 实现错误处理中间件 `backend/src/middleware/error-handler.ts`
- [ ] T014 [P] 实现文件上传中间件 `backend/src/middleware/upload.ts`（使用 multer，支持图标和 zip 包上传，zip 包限制 .zip 格式、最大 50MB）
- [ ] T015 创建 Express 应用入口 `backend/src/app.ts`，注册中间件和路由
- [ ] T016 [P] 创建前端通用布局组件 `frontend/src/components/Layout/`（Header、Footer、导航栏）
- [ ] T017 [P] 创建前端 API 基础配置 `frontend/src/services/api.ts`（axios 实例、拦截器）
- [ ] T018 [P] 创建前端类型定义 `frontend/src/types/index.ts`
- [ ] T019 [P] 创建前端 AuthContext `frontend/src/contexts/AuthContext.tsx` 和 useAuth Hook `frontend/src/hooks/useAuth.ts`
- [ ] T020 配置前端路由 `frontend/src/App.tsx`（react-router-dom）

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 浏览和发现 Skills (Priority: P1) 🎯 MVP

**Goal**: 用户可以在首页浏览热榜/推荐/上新 Skill，搜索和按分类筛选，分页浏览全部 Skill

**Independent Test**: 访问首页查看三个区块，进入探索页搜索和筛选 Skill

### Implementation for User Story 1

- [ ] T021 [US1] 实现 Skill 服务层 `backend/src/services/skill.service.ts`（列表查询、搜索、筛选、热榜、推荐、最新、zip 包下载计数）
- [ ] T022 [US1] 实现 Category 服务层 `backend/src/services/category.service.ts`
- [ ] T023 [US1] 实现 Skill 路由 `backend/src/routes/skills.ts`（GET 列表、详情、热榜、推荐、最新、zip 包下载）
- [ ] T024 [US1] 实现 Category 路由 `backend/src/routes/categories.ts`
- [ ] T025 [P] [US1] 创建 SkillCard 组件 `frontend/src/components/SkillCard/`
- [ ] T026 [P] [US1] 创建 SearchBar 组件 `frontend/src/components/SearchBar/`
- [ ] T027 [P] [US1] 创建 CategoryFilter 组件 `frontend/src/components/CategoryFilter/`
- [ ] T028 [P] [US1] 创建 Pagination 组件 `frontend/src/components/Pagination/`
- [ ] T029 [US1] 实现前端 Skills API 服务 `frontend/src/services/skills.ts`
- [ ] T030 [US1] 实现首页 `frontend/src/pages/Home/`（热榜、推荐、上新三栏布局）
- [ ] T031 [US1] 实现探索页 `frontend/src/pages/Explore/`（搜索、分类筛选、分页列表）

**Checkpoint**: 用户可以浏览首页和探索页，搜索和筛选 Skill

---

## Phase 4: User Story 2 - Skill 详情和安装指引 (Priority: P1)

**Goal**: 用户点击 Skill 卡片进入详情页，查看完整信息和安装指引

**Independent Test**: 访问某个 Skill 详情页，查看信息和安装指引，测试一键复制

### Implementation for User Story 2

- [ ] T032 [P] [US2] 创建 CopyButton 组件 `frontend/src/components/CopyButton/`
- [ ] T033 [P] [US2] 创建 MarkdownRenderer 组件 `frontend/src/components/MarkdownRenderer/`（需支持 GFM 表格扩展 react-markdown + remark-gfm）
- [ ] T034 [US2] 实现 Skill 详情页 `frontend/src/pages/SkillDetail/`（信息展示、安装指引 Tab 切换、命令行一键复制、zip 包下载按钮、Markdown 渲染）

**Checkpoint**: 用户可以查看 Skill 详情和安装指引

---

## Phase 5: User Story 3 - 用户注册登录和个人中心 (Priority: P2)

**Goal**: 用户可以注册、登录、查看和编辑个人资料

**Independent Test**: 完成注册→登录→查看个人中心→编辑资料的完整流程

### Implementation for User Story 3

- [ ] T035 [US3] 实现认证服务层 `backend/src/services/auth.service.ts`（注册、登录、获取当前用户）
- [ ] T036 [US3] 实现用户服务层 `backend/src/services/user.service.ts`（获取/更新个人资料、修改当前用户密码）
- [ ] T037 [US3] 实现认证路由 `backend/src/routes/auth.ts`
- [ ] T038 [US3] 实现用户路由 `backend/src/routes/users.ts`（添加 PUT /password 路由）
- [ ] T039 [US3] 实现前端认证 API 服务 `frontend/src/services/auth.ts`
- [ ] T040 [US3] 实现前端用户 API 服务 `frontend/src/services/users.ts`（添加修改密码接口）
- [ ] T041 [P] [US3] 实现登录页 `frontend/src/pages/Login/`
- [ ] T042 [P] [US3] 实现注册页 `frontend/src/pages/Register/`
- [ ] T043 [US3] 实现个人中心页 `frontend/src/pages/Profile/`（个人资料展示/编辑、已提交 Skill 列表、修改密码表单）
- [ ] T057 [US3] 在个人中心页 `frontend/src/pages/Profile/` 添加修改密码表单（旧密码+新密码+确认密码，前端校验）

**Checkpoint**: 用户可以注册、登录、管理个人资料

---

## Phase 6: User Story 4 - Skill 提交与管理 (Priority: P2)

**Goal**: 用户可以提交 Skill，管理员可以审核通过/拒绝

**Independent Test**: 登录后提交 Skill，管理员审核通过后在前台可见

### Implementation for User Story 4

- [ ] T044 [US4] 实现审核服务层 `backend/src/services/review.service.ts`
- [ ] T045 [US4] 实现 Skill 路由补充 `backend/src/routes/skills.ts`（POST 创建、PUT 更新、DELETE 删除，创建和更新支持 zip 包上传；PUT/DELETE 权限校验：普通用户只能操作自己的 Skill，管理员可操作任意 Skill，越权返回 403）
- [ ] T046 [US4] 实现管理员路由 `backend/src/routes/admin.ts`（待审核列表（返回完整信息：名称、描述、内容、版本、分类、作者、提交时间）、通过、拒绝、用户管理、修改任意用户密码）
- [ ] T059 [US4] 实现 Skill 列表可见性策略和版本分支策略：公开列表只显示 approved 且未被取代的版本；更新已发布 Skill 时创建新版本（pending），原版本保持不变；审核通过时新版本 approved，旧版本 superseded
- [ ] T061 [US4] 修改 Skill 模型，添加 parent_id 字段和 superseded 状态支持
- [ ] T062 [US4] 添加获取 Skill 版本历史的服务方法 `getVersionHistory(skillId)`
- [ ] T047 [US4] 实现 Skill 提交页 `frontend/src/pages/SubmitSkill/`（表单填写、分类选择、图标上传、zip 包上传）
- [ ] T048 [US4] 实现管理员后台页 `frontend/src/pages/Admin/`（待审核列表、审核操作、审核记录、用户管理）
- [ ] T058 [US4] 在管理员后台 `frontend/src/pages/Admin/` 新增"Skill 管理"标签页（独立于待审核列表），展示所有 Skill 列表，支持分页，提供编辑和删除按钮，管理员可对任意 Skill 进行编辑或删除，不受审核状态限制
- [ ] T055 [US4] 实现 Skill 编辑页 `frontend/src/pages/EditSkill/`（复用 SubmitSkill 表单，回填现有数据，提交后进入重新审核流程；仅作者和管理员可访问）
- [ ] T056 [P] [US4] 在个人中心页 `frontend/src/pages/Profile/` 已提交 Skill 列表中添加"编辑"和"删除"按钮（仅展示给作者；删除时弹出二次确认对话框）

**Checkpoint**: Skill 提交和审核流程完整可用

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T049 [P] 首页和列表页响应式布局适配（移动端/平板/桌面端）
- [ ] T050 [P] 添加全局 loading 状态和错误提示（Toast 通知）
- [ ] T051 [P] 创建数据库初始化脚本（种子数据：默认分类、管理员账号）
- [ ] T052 [P] 添加自定义 favicon 图标 `frontend/public/favicon.svg`，更新 `frontend/index.html` 引用
- [ ] T053 创建 README.md（项目说明、环境要求、安装步骤、启动方式）
- [ ] T054 前后端联调和整体功能验证

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on Phase 3（需要 Skill 数据和路由）
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion, 可与 Phase 3 并行
- **User Story 4 (Phase 6)**: Depends on Phase 3 + Phase 5（需要 Skill 路由和用户认证）
- **Polish (Phase 7)**: Depends on all user stories being complete

### Parallel Opportunities

- Phase 1: T001 和 T002、T003 可并行
- Phase 2: 所有标记 [P] 的任务可并行（模型、中间件、前端组件）
- Phase 3: T025-T028 前端组件可并行
- Phase 5: T041 和 T042 可并行
- Phase 7: T049-T051 可并行

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (浏览发现)
4. Complete Phase 4: User Story 2 (详情页)
5. **STOP and VALIDATE**: 验证浏览和详情功能

### Incremental Delivery

1. Setup + Foundational → 基础就绪
2. User Story 1 + 2 → 浏览和详情可用 (MVP!)
3. User Story 3 → 用户系统可用
4. User Story 4 → 提交和审核可用
5. Polish → 整体优化

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
