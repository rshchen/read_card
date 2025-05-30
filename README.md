# 專案介紹
## 專案名稱
本專案利用google表單，達成線上畫卡的自動化流程，從表單製作到讀卡與成績寄送由幾個子專案組成：
1. 表單製作專案：[**build_form**](#build_form專案)
2. 成績計算專案：[**calculate_grades**](#calculate_grades專案)。


# build_form專案

## 簡介
在build_form專案中，我們使用 Google Apps Script (GAS) 自動化創建 Google 畫卡表單，用來收集學生的作答情形。專案使用者可以直接複製此專案並部署，無需額外的本地設置或工具。

## 如何複製並部署專案

### 步驟 1: 複製專案

1. 登入google帳號，點擊以下連結，將專案複製到你的 Google 帳號中：

   [**複製專案**](https://script.google.com/home/projects/1jVlsuye57oIkpBsYabYH9LEnT06GjJruFoQssRtJpPJxpBC-RNEIciZX?pli=1)

2. 右上角有三個圖示，分別表示「建立副本、新增至已加星號專區、移除專案」，請點擊「**建立副本**」按鈕，這會創建一個專屬於你的副本，並將其添加到你的 Google Apps Script 帳戶中。

### 步驟 2: 開始部署

1. 在 Google Apps Script 編輯器中，進入你的專案。
2. 你會看到 `程式碼.gs` 文件，這是專案的核心程式碼。
3. 根據需求，你可以修改表單內容、回應設置等。
4. 點擊藍色按鈕「部署 > 新增部署作業 」，部署作業類型為「網頁應用程式」，然後選擇「執行應用程式的使用者」為「我自己」，並選擇「誰有權訪問」為「只有我自己」。

### 步驟 3: 授權

當你第一次執行腳本時，Google 會要求你授權應用程式來訪問 Google 帳號中的相關資料（如 Google 表單、Google Sheets 等）。只需按下 **允許**，授予腳本所需的權限。

### 步驟 4: 完成部署

完成以上步驟後，會產生一個網頁應用程式
網址，點擊後會進入表單生成的使用者網頁，依照指示輸入就會生成表單，
生成的題目有三個大題：一、選擇題；二、多選題；三、選填題


# calculate_grades專案

## `calculate_grades` 專案使用說明

點擊以下連結開啟 Colab 筆記本：
[讀卡新版.ipynb](https://colab.research.google.com/drive/1olh4g38J187Y7CBLHPC2Nzpsuvf5A0pF?usp=sharing)

### 操作步驟：

1. 點選 `檔案 > 在雲端硬碟中另存副本`，將 notebook 儲存到你的 Google 雲端硬碟。
2. 點選 `執行階段 > 全部執行`，以執行整份程式。
3. 依照 notebook 中的指示操作，即可：

   * 讀取來自 Google 表單的回應資料
   * 自動計算學生的成績





---

## 授權

本專案使用 [MIT 授權](LICENSE)。

---

## 聯絡

若有任何問題，請聯繫 \[本人公開mail]。

