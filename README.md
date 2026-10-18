# HTML Space

网址：https://elarazju.github.io/

用于展示和分享 AI 生成的 HTML。所有发布的文件均可公开访问。

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

本站采用纯静态 HTML/CSS/JS，GitHub Pages 从 `main` 分支根目录发布，`.nojekyll` 禁用 Jekyll 处理。目录通过公开 GitHub API 获取；API 限流不影响已发布页面的直接访问。
