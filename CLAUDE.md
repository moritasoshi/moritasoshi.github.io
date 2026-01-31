# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

GitHub Pages用の個人ポートフォリオサイト。フリップ可能な名刺デザインを採用した単一のHTMLファイルで構成される静的サイト。

## 技術構成

- **静的サイト**: ビルドプロセスなし、`index.html`を直接編集
- **ホスティング**: GitHub Pages（`main`ブランチから自動デプロイ）
- **スタイリング**: インラインCSS（外部ファイルなし）

## 開発方法

ローカルでの確認:
```bash
# 任意のHTTPサーバーで確認
python -m http.server 8000
# または
npx serve .
```

`main`ブランチへのpushで自動的にGitHub Pagesにデプロイされる。
