# AIRI 二次开发说明

此 Fork 保存个人二次开发，原项目为 <https://github.com/moeru-ai/airi>。
当前开发基线为 `v0.12.0`。保留上游许可证和署名。

## 常用入口

- [更新日志](custom-changelog.md)：查看每次更新的文件、函数、行为和验证结果。
- [问题与优化清单](issues-and-improvements.md)：记录问题、需求和待优化的地方。
- [项目协作规范](AGENTS.md)：开发前阅读，并检查目标目录的补充规范。
- `apps/stage-tamagotchi`：Electron 桌面端。
- `apps/stage-web`：浏览器端。
- `packages/stage-ui`：共享角色、模型、设置和交互逻辑。

## Git 工作方式

- `origin` 指向个人 Fork：`https://github.com/Bluestar-34/airi.git`。
- `upstream` 指向原项目：`https://github.com/moeru-ai/airi.git`。
- 功能分支使用 `<用户名>/feat/<功能名>`。
- 修复分支使用 `<用户名>/fix/<问题名>`。
- 本次功能分支为 `bluestar-34/feat/character-window-drag`。
- 使用 Conventional Commits，例如 `feat(stage-tamagotchi): drag window from character canvas`。
- 功能代码、测试和对应更新日志一起提交。
- 协作规范变更单独提交。
- 提交前检查暂存差异，避免混入无关文件。
- 推送到个人 Fork，不直接推送上游。
- 未经明确授权，不强制推送、不删除远端分支、不改写已发布历史。

获取远端状态：

```powershell
git fetch origin
git fetch upstream --tags
git status --short
git log --oneline --decorate -5
```

当前仓库使用浅克隆。需要较早历史时，先获取所需提交。
升级上游版本前，先评估差异，再在新分支完成集成和验证。
普通拉取使用 rebase，不自动将上游主分支混入稳定版本二开分支。

## 开发与验证

Node 和 pnpm 版本以 `.tool-versions` 与 `package.json` 为准。
当前版本为 Node 26.7.0、pnpm 11.24.0。
本机源码、应用、应用数据和项目缓存放在 F 盘。
本机启动脚本位于 `F:\Apps\AIRI`，它们不属于版本化源码。

```powershell
pnpm install --frozen-lockfile
pnpm dev:tamagotchi
```

提交桌面端改动前，执行对应测试和以下检查：

```powershell
pnpm -F @proj-airi/stage-tamagotchi typecheck
pnpm -F @proj-airi/stage-tamagotchi build
pnpm lint
git diff --check
git diff --cached
```

按改动范围选择测试。共享包变动还需检查依赖方。
区分通过的检查、失败的检查与未执行的检查。
浏览器测试不能替代原生窗口行为的端到端验证。

## 每次交付记录

1. 先查看问题清单，确认本次范围。
2. 创建或确认对应功能分支。
3. 修改代码，并运行必要验证。
4. 在更新日志记录具体路径、函数或配置项。
5. 记录行为变化、验证命令、结果及已知限制。
6. 审查差异，提交并推送个人 Fork。
7. 向用户提供分支、提交及更新文件链接。

问题清单中的用户原文必须保留。
处理结果需要包含验证证据与关联提交。
若用户尚未验收，则标记为“待验收”，不能代替用户确认完成。

## 不进入 Git 的内容

API Key、`.env`、本机应用数据、缓存、模型下载产物、日志、构建产物和安装包不进入提交。
推送前审查新增文件。不要将个人运行配置复制进仓库。
