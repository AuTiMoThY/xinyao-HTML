# 抓藥系統改版

## 📝 專案簡介
使用 vue3 + scss + Gulp 開發的藥方調理平台之前端頁面，提供使用者便捷的線上藥方管理服務。


## 🔗 相關連結
- [前台網站](https://demo.auozzy.com/xinyao-html/)

## ✨ 功能特點
### 前台功能
- 藥方目錄
  - 可查看藥方說明
  - 可選擇部位並添加藥方至調理帖
- 調理帖功能
  - 可增加藥方份量，並設有上限值
- 調理帖紀錄、常用調理帖
  - 可查看過去調理帖及其藥方
  - 可再次添加藥方至調理帖
  - 可刪除調理帖

## 🛠 技術
### 前端
- Vue 3 (Composition API)
- Pinia 狀態管理
- SCSS 樣式處理
- Gulp 自動化工具

### 開發特色
- RWD響應式設計，支援電腦、手機瀏覽
- 組件化開發，提高代碼復用性
- 自定義提示訊息元件
- 優化的使用者互動效果
- 資料列表性能優化

## 💻 環境要求
- Node.js v22.11.0
- npm v10.9.0

## 🔧 安裝說明
1. 下載專案
```bash
git clone https://github.com/AuTiMoThY/meeting-mgmt-nuxt3.git
cd meeting-mgmt-nuxt3
``` 

2. 安裝依賴
```bash
npm install
```

3. 啟動開發伺服器
```bash
gulp
```

4. 訪問網站
```bash
http://localhost:8081
```

5. 靜態檔案位於: `dist` 資料夾

## 📸 系統展示
![目錄頁](https://demo.auozzy.com/picture/xinyao-index.jpg)
![訂單頁](https://demo.auozzy.com/picture/xinyao-order.jpg)
![提示訊息](https://demo.auozzy.com/picture/xinyao-modal.jpg)
![資料列表性能優化](https://demo.auozzy.com/picture/xinyao-datatable.jpg)

