# 吳丞恩 個人網站

這是一個以 React + TypeScript 建置的個人網站，包含三個主要區塊：

- 網站介紹
- 個人簡介
- 小遊戲：貪吃蛇

## 開始

```bash
npm install
npm run dev
```

網站會在 `http://localhost:4173` 開啟。

## 打包

```bash
npm run build
```

## 內容介紹

- `src/App.tsx`：主頁面結構
- `src/components/IntroSection.tsx`：網站介紹
- `src/components/ProfileSection.tsx`：個人簡介
- `src/components/SnakeGame.tsx`：貪吃蛇小遊戲

## 部署到 GitHub Pages

1. 將專案推到 GitHub 倉庫。
2. 在 GitHub 倉庫設定中啟用 Pages，選擇 `gh-pages` 分支或 `main` 分支中的 `dist/` 資料夾。
3. 建置後部署靜態檔案。
