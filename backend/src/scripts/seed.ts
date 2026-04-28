import { sequelize } from '../config/database';
import { User, Category, Skill } from '../models';
import { hashPassword } from '../utils/password';

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('Database synced (force).');

    // Create admin user
    const adminPwd = await hashPassword('admin123');
    const admin = await User.create({
      email: 'admin@skillhub.com',
      password_hash: adminPwd,
      nickname: 'Admin',
      role: 'admin',
    });

    // Create demo user
    const userPwd = await hashPassword('user123');
    const demoUser = await User.create({
      email: 'demo@skillhub.com',
      password_hash: userPwd,
      nickname: 'Demo User',
      role: 'user',
    });

    // Create categories
    const cats = await Category.bulkCreate([
      { name: '编程开发', description: '代码生成、调试、重构等编程相关技能', sort_order: 1 },
      { name: '写作创作', description: '文章撰写、翻译、文案创作等', sort_order: 2 },
      { name: '数据分析', description: '数据处理、可视化、统计分析等', sort_order: 3 },
      { name: '设计创意', description: 'UI/UX 设计、图片生成、创意构思等', sort_order: 4 },
      { name: '效率工具', description: '自动化、工作流优化、项目管理等', sort_order: 5 },
      { name: '学习教育', description: '知识问答、教学辅助、语言学习等', sort_order: 6 },
    ]);

    // Create sample skills
    const skills = [
      { name: 'Code Reviewer', description: '智能代码审查工具，自动分析代码质量并提供改进建议', version: '2.1.0', category_id: cats[0].id, download_count: 15230, is_recommended: true, install_command: 'npx install-skill code-reviewer', content: '# Code Reviewer\n\n自动分析代码质量，提供改进建议。\n\n## 功能\n- 代码风格检查\n- 潜在 Bug 检测\n- 性能优化建议\n- 安全漏洞扫描' },
      { name: 'SQL Generator', description: '根据自然语言描述自动生成 SQL 查询语句', version: '1.5.0', category_id: cats[0].id, download_count: 12800, is_recommended: true, install_command: 'npx install-skill sql-generator', content: '# SQL Generator\n\n将自然语言转换为 SQL 查询。\n\n## 支持\n- MySQL\n- PostgreSQL\n- SQLite' },
      { name: 'Article Writer', description: '专业文章撰写助手，支持多种文体和风格', version: '3.0.0', category_id: cats[1].id, download_count: 9500, is_recommended: true, install_command: 'npx install-skill article-writer', content: '# Article Writer\n\n专业的文章撰写助手。' },
      { name: 'Data Visualizer', description: '数据可视化工具，支持多种图表类型', version: '1.2.0', category_id: cats[2].id, download_count: 7600, install_command: 'npx install-skill data-visualizer', content: '# Data Visualizer\n\n快速生成数据可视化图表。' },
      { name: 'UI Designer', description: 'AI 驱动的 UI 设计助手，快速生成设计稿', version: '1.0.0', category_id: cats[3].id, download_count: 6200, is_recommended: true, install_command: 'npx install-skill ui-designer', content: '# UI Designer\n\nAI 驱动的 UI 设计工具。' },
      { name: 'Task Automator', description: '工作流自动化工具，减少重复劳动', version: '2.0.0', category_id: cats[4].id, download_count: 5100, install_command: 'npx install-skill task-automator', content: '# Task Automator\n\n自动化日常工作流程。' },
      { name: 'Language Tutor', description: '多语言学习助手，支持对话练习和语法纠正', version: '1.3.0', category_id: cats[5].id, download_count: 4800, install_command: 'npx install-skill language-tutor', content: '# Language Tutor\n\n交互式语言学习工具。' },
      { name: 'API Tester', description: 'API 接口测试工具，支持自动生成测试用例', version: '1.1.0', category_id: cats[0].id, download_count: 8900, install_command: 'npx install-skill api-tester', content: '# API Tester\n\n自动化 API 测试工具。' },
    ];

    for (const s of skills) {
      await Skill.create({
        ...s,
        author_id: admin.id,
        status: 'approved',
      });
    }

    console.log('Seed data created successfully!');
    console.log('Admin: admin@skillhub.com / admin123');
    console.log('User:  demo@skillhub.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
