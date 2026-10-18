#!/usr/bin/env python3
"""Upload a standalone HTML file using the already authenticated GitHub CLI."""
import argparse
import base64
import json
import re
import subprocess
from pathlib import Path

REPO = "elarazju/elarazju.github.io"


def main():
    parser = argparse.ArgumentParser(description="上传单文件 HTML 到 GitHub Pages（需要 gh 登录和仓库写权限）")
    parser.add_argument("file", type=Path)
    parser.add_argument("--name", help="目标文件名，例如 my-demo.html")
    args = parser.parse_args()
    name = args.name or args.file.name
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*\.html?", name, flags=re.I):
        parser.error("请使用英文、数字、点、短横线或下划线组成的 .html/.htm 文件名")
    try:
        content = args.file.read_bytes()
        content.decode("utf-8")
    except (OSError, UnicodeError) as error:
        parser.error(f"无法读取 UTF-8 HTML：{error}")
    # Omitting 'sha' intentionally makes existing paths fail instead of overwriting.
    payload = json.dumps({"message": f"Publish {name}", "content": base64.b64encode(content).decode("ascii"), "branch": "main"})
    try:
        result = subprocess.run(["gh", "api", "--method", "PUT", f"repos/{REPO}/contents/pages/{name}", "--input", "-", "--jq", ".commit.sha"], input=payload, text=True, capture_output=True)
    except FileNotFoundError:
        parser.exit(1, "请先安装并登录 GitHub CLI（gh）。\n")
    if result.returncode:
        parser.exit(1, f"上传失败。请检查登录、写权限和文件是否重名。\n{result.stderr}")
    print(f"已提交：{result.stdout.strip()}")
    print(f"网址：https://elarazju.github.io/pages/{name}")
    print("请等待 GitHub Pages 部署完成后访问；这不是即时上传服务。")


if __name__ == "__main__":
    main()
