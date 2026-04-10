# Keyboard Monitor

macOS 键盘按键监控应用，记录每日所有按键（单键 + 组合键），通过 Next.js 仪表盘展示统计数据。

## 架构

```
[Swift 守护进程] --写入--> [SQLite DB] <--读取-- [Next.js 仪表盘]
```

- **守护进程**：Swift + CGEvent Tap，全局捕获键盘事件，每秒批量写入 SQLite
- **数据库**：SQLite（WAL 模式），存放在 `~/.keyboard-monitor/data.db`
- **前端**：Next.js + shadcn/ui + Recharts

## 快速开始

### 1. 编译守护进程

```bash
cd daemon
bash build.sh
```

### 2. 授权辅助功能权限

首次运行需要在 **系统设置 > 隐私与安全性 > 辅助功能** 中添加 `keyboard-monitor` 二进制文件并启用。

### 3. 启动守护进程

手动启动：

```bash
./keyboard-monitor &
```

或安装为开机自启服务：

```bash
bash install.sh
```

卸载：

```bash
bash uninstall.sh
```

### 4. 启动仪表盘

```bash
cd web
npm install
npm run dev
```

浏览器打开 http://localhost:3000

## 仪表盘功能

- 每日按键总数、不同按键数、最常用组合键概览
- 过去 30 天按键趋势折线图
- Top 20 按键柱状图
- 组合键频率表格（支持搜索过滤）
- 日期切换浏览历史数据
- 守护进程运行状态指示

## 项目结构

```
daemon/
  KeyboardMonitor.swift    # 守护进程核心
  keycode-map.swift        # macOS 键码映射
  main.swift               # 入口
  build.sh                 # 编译脚本
  install.sh / uninstall.sh

web/
  app/page.tsx             # 仪表盘主页
  app/api/stats/           # API 端点
  components/              # UI 组件
  lib/                     # 数据层
```

## 注意事项

- 密码管理器等启用 Secure Input 的应用会屏蔽键盘捕获，这是 macOS 的安全机制
- 数据量约 150MB/月，SQLite 可长期承载
- 重新编译守护进程后需在辅助功能中删除再重新添加
