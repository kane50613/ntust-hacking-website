# 社員管理系統 ── 台科大資訊安全研究社

資安社面臨日益增長的社員管理複雜性，需要一個集中化的活動管理解決方案。現有用 Google 表單收集簽到和回饋的方式，讓成員需要操作的步驟較多，使用單一登入 (Single Sign On) 能夠讓增加安全性及簡化成員認證的流程，並且整合到我們現有的 Discord 群組來驗證成員身份。

## 在本地執行

需要先準備好 [bun](https://bun.sh/) 執行環境，之後接著執行下列步驟跑起來

### 環境變數

先到 [Discord Developer Portal](https://discord.com/developers/applications) 創建一個新的應用程式，點 OAuth2 分頁就可以取得 Client ID 和 Client Secret

在 `.env` 檔案中設定下列環境變數

```bash
# Session 密鑰
JWT_SECRET=隨機字串
# Discord OAuth 客戶端 ID、密鑰
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
```

### 準備資料庫

在本地跑時不用準備 Postgres 資料庫，會使用 [PGLite](https://pglite.dev/) 直接在網頁伺服器裡跑資料庫（詳見[app/db/index.ts](app/db/index.ts)），資料庫文建會儲存在 `pg-data` 資料夾裡

```bash
bun install
bun run db:push
```

### 啟動服務

```bash
bun run dev
```

終端機會提示伺服器啟動在 http://localhost:5173，點下去就可以看到網頁
