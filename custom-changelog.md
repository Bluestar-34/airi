# 二次开发更新日志

每次更新追加一条记录，最新记录放在最上面。
记录改动原因、具体文件与位置、行为变化、验证结果和未验证项。
通过 `git log --oneline -- <文件路径>` 查看关联提交。

## 2026-10-28：个人 Fork 与开发协作流程

### 改动原因

把二开代码同步到个人 GitHub，并持续记录更新位置、问题与优化想法。

### 更新文件与位置

| 文件 | 具体位置 | 更新内容 |
| --- | --- | --- |
| `custom-development.md` | Git 工作方式、开发与验证、每次交付记录 | 约定远端、分支、提交规范、检查和交付要求。 |
| `issues-and-improvements.md` | 随手记录区、待处理区、已完成区与模板 | 预留用户问题和优化记录，区分开发完成与用户验收。 |
| `custom-changelog.md` | 本记录及后续记录模板 | 每次列出更新文件、具体符号、行为与验证证据。 |
| `AGENTS.md` | `Personal Fork Workflow` | 持久化个人开发要求。协作规范作为独立提交。 |

### Git 配置

- 个人 Fork：`https://github.com/Bluestar-34/airi`。
- 功能分支：`bluestar-34/feat/character-window-drag`。
- `origin` 指向个人 Fork，`upstream` 指向原项目。
- 本地启用 `pull.rebase=true` 和 `fetch.prune=true`。
- 人物拖拽功能提交：`2677d2f`。
- 更新日志不包含本机密钥、运行配置、缓存或安装包。

### 验证方式

- `git diff --check`：检查空白错误。
- 提交钩子 `pnpm nano-staged`：执行暂存文件检查。
- 推送后对比本地 HEAD 与 GitHub 分支提交。
- 最终交付时报告推送是否成功，不把本地提交当作远端同步完成。

## 2026-10-28：拖拽人物移动桌面窗口

### 改动原因

原来需要拖动控制栏按钮才能移动窗口。
当控制栏移出屏幕时，用户无法通过人物区域找回窗口。

### 更新文件与位置

| 文件 | 具体位置 | 更新内容 |
| --- | --- | --- |
| `apps/stage-tamagotchi/src/renderer/composables/use-stage-window-drag.ts` | `useStageWindowDrag()` | 监听人物画布的鼠标指针事件。左键移动达到 5 像素后触发原生窗口拖动。 |
| `apps/stage-tamagotchi/src/renderer/pages/index.vue` | `fullscreenActive` 初始化后的 `useStageWindowDrag()` 调用 | 接入画布引用与 `electronStartDraggingWindow`。在加载、暂停、全屏或控制栏弹层激活时禁用人物拖窗。 |
| `apps/stage-tamagotchi/src/renderer/composables/use-stage-window-drag.browser.test.ts` | `character window dragging` 测试组 | 覆盖阈值、单次触发、单击、按钮、右键、禁用、取消、失焦和作用域销毁。 |

### 验证结果

以下命令在仓库根目录执行。
浏览器测试使用 F 盘的 Playwright 浏览器缓存。

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = 'F:\Apps\AIRI\cache\playwright'
pnpm -F @proj-airi/stage-tamagotchi exec vitest run src/renderer/composables/use-stage-window-drag.browser.test.ts
pnpm -F @proj-airi/stage-tamagotchi typecheck
pnpm -F @proj-airi/stage-tamagotchi build
pnpm lint
git diff --check
```

- 浏览器测试：3/3 通过。
- 桌面端类型检查：通过。
- 桌面端构建：通过。
- 全仓 lint：0 错误，665 条上游警告。
- 差异格式检查：通过。
- 本机二开版：已启动，并沿用 F 盘原有应用数据。

### 范围与限制

- 人物拖窗使用 Windows/macOS 的现有原生拖动接口。
- Linux 不启用这个接口，沿用原有拖动方式。
- 浏览器测试验证拖动手势与接口回调，不代表原生系统拖动的端到端验证。
- 本次没有增加窗口边界限制，也没有更换角色模型。

## 后续记录模板

```markdown
## YYYY-MM-DD：更新标题

### 改动原因

### 更新文件与位置

| 文件 | 函数、组件或配置项 | 更新内容 |
| --- | --- | --- |

### 验证结果

- 命令与结果：

### 范围与限制

- 未验证项、已知限制与回退方式：
```
