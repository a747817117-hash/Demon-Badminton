# Demon Badminton - 羽毛球拍涂装设计平台

一个专业的羽毛球拍涂装在线设计平台，让用户可以自由设计球拍涂装。

## 功能特性

### 前端用户功能
- 🎨 3D球拍涂装编辑器 (Three.js)
- 🖌️ 2D图案设计工具
- 📋 预设模板选择与修改
- 🎨 颜色/图案素材库
- 💾 设计保存和分享
- 📤 导出高清设计图
- 🏆 设计广场/社区展示

### 后台管理功能
- 👥 用户管理
- 🎨 素材/模板管理
- 📊 数据统计分析
- ✅ 内容审核

## 技术栈

### 前端
- React 18 + TypeScript
- Three.js + React Three Fiber (3D渲染)
- Zustand (状态管理)
- React Router (路由)
- Axios (HTTP请求)
- Tailwind CSS (样式)
- Vite (构建工具)

### 后端
- Django 4.x
- Django REST Framework
- MySQL / SQLite
- Redis (缓存)
- Celery (异步任务)
- JWT认证

## 快速开始

### 前置要求
- Node.js 18+
- Python 3.10+
- MySQL 8.0 (可选，默认使用SQLite)

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:3000 运行

### 后端启动

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

后端将在 http://localhost:8000 运行

### Docker启动

```bash
docker-compose up -d
```

## 项目结构

```
Demon-Badminton/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── components/          # React组件
│   │   │   ├── Editor3D/        # 3D编辑器
│   │   │   ├── Editor2D/        # 2D设计工具
│   │   │   └── Common/          # 公共组件
│   │   ├── pages/               # 页面组件
│   │   ├── stores/              # 状态管理
│   │   ├── services/            # API服务
│   │   └── hooks/               # 自定义Hooks
│   └── public/                  # 静态资源
│
├── backend/                     # 后端项目
│   ├── config/                  # Django配置
│   ├── apps/
│   │   ├── users/               # 用户模块
│   │   ├── designs/             # 设计作品模块
│   │   ├── materials/           # 素材库模块
│   │   ├── templates_app/       # 模板模块
│   │   └── assets/              # 资源文件模块
│   └── api/v1/                  # REST API
│
├── docker-compose.yml           # Docker配置
└── README.md
```

## API文档

启动后端后访问:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License
