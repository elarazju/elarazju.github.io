# 发布 HTML

本仓库是公开的 GitHub Pages HTML 展示空间。

- 发布目标为 `elarazju/elarazju.github.io` 的 `main` 分支。
- 默认在 `pages/` 下新增独立 HTML，使用唯一的英文文件名；除非用户明确要求更新，不覆盖已有文件。
- 相关静态资源放在同一页面的独立资源目录，并使用相对路径。
- 保留根目录首页、`assets/`、`.nojekyll` 和其他已发布的文件。
- 不提交凭证、隐私信息或不属于当前网页的文件。
- 单文件 HTML 可以使用 `python3 scripts/publish.py /absolute/path/to/file.html` 上传；需已授权的 GitHub CLI。
- 多文件页面通过 Git 将 HTML 和资源一同提交到 main。
- 推送后检查 Pages 部署结果，再打开页面验证并返回 `https://elarazju.github.io/pages/<filename>.html`。
- GitHub Actions 发布时自动生成 `pages/` 下的 HTML 文件列表，无需修改首页或目录。
