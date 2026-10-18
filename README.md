# AI 日报归档

网址：https://elarazju.github.io/

用于展示和分享每天的 AI 日报 HTML。所有发布的文件均可公开访问。

日报使用 `pages/YYYY-MM-DD.html` 命名，日期以 `Asia/Shanghai` 时区为准；首页按日期倒序展示。同日重发更新当天文件，保留其他历史日报。`pages/hello.html` 只是发布示例。

计划中的 Make 上传流程：Custom webhook 接收 `date` 和 `html` → 校验日期并生成固定路径 → 使用 Make 内保存的 GitHub 授权读取现有文件 SHA（存在时）→ 写入当天日报 → 返回 `committed` 状态和预计网址。GitHub Pages 随后异步发布。Make webhook 尚未创建，当前可通过 GitHub 直接上传。

## 给 AI 的发布指令

把生成的 HTML 提交到 `elarazju/elarazju.github.io` 仓库的 `main` 分支，存放在 `pages/` 文件夹，使用唯一的英文文件名。保留首页及现有文件。需要的图片、CSS、JavaScript 一起上传，使用相对路径。提交后等待 GitHub Pages 部署成功，返回对应的公开网址。

例如：`pages/report.html` 对应 `https://elarazju.github.io/pages/report.html`。

AI 必须具备本仓库写入权限（已登录的 GitHub CLI、Git 或已授权的 GitHub API）。网页地址本身不是上传 API，也没有匿名上传入口。不要向网页或仓库提交令牌、密码和敏感信息。

## 手动上传

打开 https://github.com/elarazju/elarazju.github.io/upload/main/pages ，选择 HTML 文件并提交。GitHub Pages 会自动发布，通常需要几分钟。首页自动从 GitHub 读取 `pages/` 中的 HTML 文件目录；如果目录暂时无法加载，可以使用文件的直接网址。

## 发布单个 HTML

已登录 `gh` 且对仓库有写权限时：

```sh
python3 scripts/publish.py /absolute/path/to/page.html
```

此命令上传单个 HTML，不会自动上传依赖的资源。适合 CSS/JS 内嵌的独立 HTML。多文件页面应通过 Git 一起提交资源。

默认使用输入文件的文件名；如有重名会拒绝覆盖。使用 `--name unique-name.html` 选择其他名称。输出网址后需等待 GitHub Pages 部署完成。

本站采用纯静态 HTML/CSS/JS。每次提交到 `main`，GitHub Actions 自动生成网页目录并部署到 Pages。目录随网页一起发布，不依赖访客调用 GitHub API。`pages.json` 是本地预览用的初始目录，线上目录由构建自动生成。
