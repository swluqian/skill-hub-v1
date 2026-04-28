# Skill Hub Constitution

## Core Principles

### I. 前后端分离
前端和后端作为独立项目开发和部署。后端提供 RESTful API，前端通过 HTTP 请求调用。两者通过明确的 API 契约通信，互不依赖对方的内部实现。

### II. 简单直接
优先选择简单方案，避免过度设计。不引入不必要的抽象层、设计模式或中间件。每个模块职责单一，代码可读性优先于"优雅"。

### III. 数据驱动
所有业务状态持久化到 MySQL 数据库。使用 Sequelize ORM 进行数据访问，避免手写 SQL（除非 ORM 无法满足的复杂查询）。数据模型是系统的核心，API 围绕数据模型设计。

### IV. 安全优先
用户密码必须使用 bcrypt 哈希存储，永远不存储明文密码。API 认证使用 JWT Token。所有用户输入必须验证和清洗。文件上传必须限制类型和大小。管理员操作必须验证权限。

### V. 渐进式交付
按用户故事优先级逐步交付功能。每个用户故事独立可测试、可部署。先完成 MVP（浏览+详情），再扩展用户系统和提交审核功能。

## Technology Constraints

- **后端**: Node.js 18+ / TypeScript / Express.js / Sequelize ORM
- **前端**: React 18 / TypeScript / Vite / React Router
- **数据库**: MySQL 8.0+，不使用 Docker
- **文件存储**: 本地文件系统（`backend/uploads/`）
- **认证**: JWT（jsonwebtoken）
- **密码**: bcryptjs
- **不使用**: Docker、云存储、第三方 OAuth、微服务架构

## Development Workflow

- 按 Phase 顺序开发，Phase 2 完成前不开始用户故事
- 每个任务完成后进行基本功能验证
- 每个 Checkpoint 进行阶段性集成验证
- 代码提交粒度：每个任务或逻辑分组一次提交
- 前后端可并行开发，通过 API 契约解耦

## Governance

- 本准则适用于 Skill Hub 项目的所有开发活动
- 技术选型变更需要更新本文档
- 新增依赖需要评估必要性，避免依赖膨胀

**Version**: 1.0.0 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-04-22
