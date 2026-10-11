# TaskFlow

TypeScript・Reactで開発した、シンプルなタスク管理Webアプリケーションです。

タスクの登録から進捗管理までを直感的に操作できるように設計しました。

## デモ

[TaskFlowをブラウザで開く](https://taskflow-nine-teal.vercel.app/)

## 主な機能

- タスクの新規登録
- タスクの編集・削除
- タスクの完了・未完了の切り替え
- タスクの検索
- ステータスによるフィルタリング
- タスク件数・進捗状況の表示
- LocalStorageによるデータ保存
- レスポンシブデザイン

## 技術スタック

| 分類 | 使用技術 |
|---|---|
| 言語 | TypeScript |
| フロントエンド | React 19 |
| ビルドツール | Vite 8 |
| スタイリング | CSS |
| データ保存 | LocalStorage |
| コンテナ | Docker |
| Webサーバー | Nginx |
| ソースコード管理 | Git / GitHub |
| 開発環境 | GitHub Codespaces |
| デプロイ | Vercel |

## システム構成

React + TypeScriptで構築したクライアントサイドアプリケーションです。

タスクデータはブラウザのLocalStorageに保存するため、バックエンドサーバーやデータベースを必要としません。

Dockerではマルチステージビルドを採用し、Node.jsでビルドした静的ファイルをNginxで配信する構成にしています。

## ローカルでの実行方法

Node.jsとnpmが必要です。

```bash
git clone https://github.com/Kazuki-creator/taskflow.git
cd taskflow
npm ci
npm run dev
```

## Dockerでの実行方法

Dockerが必要です。

```bash
docker build -t taskflow:1.0 .
docker run --rm -d --name taskflow -p 8080:80 taskflow:1.0
```

起動後、`http://localhost:8080` にアクセスしてください。

## 今後の拡張予定

- バックエンドAPIとの連携
- データベースへのタスク保存
- ユーザー認証機能
- 自動テスト・CI/CDの整備

## ソースコード

https://github.com/Kazuki-creator/taskflow
