# Software Studio 2023 Spring Midterm Project

### Scoring

| **Basic components** | **Score** | **Check** |
| :------------------- | :-------: | :-------: |
| Membership Mechanism |    15%    |     Y     |
| Firebase page        |    5%     |     Y     |
| Database read/write  |    15%    |     Y     |
| RWD                  |    15%    |     Y     |
| Chatroom             |    20%    |     Y     |

| **Advanced tools**  | **Score** | **Check** |
| :------------------ | :-------: | :-------: |
| Using React         |    10%    |     Y     |
| Third-Party Sign In |    1%     |     Y     |
| Notification        |    5%     |     Y     |
| CSS Animation       |    2%     |     Y     |
| Security            |    2%     |     Y     |

| **Other useful functions** | **Score** | **Check** |
| :------------------------- | :-------: | :-------: |
| Profile picture            |    1%     |     Y     |
| Send image                 |    1%     |     Y     |
| Chatbot                    |    2%     |     Y     |
| Send gif from Tenor API    |    3%     |     Y     |

---

### How to use

#### 登入

首先登入和註冊帳號就和一般的一樣。然後可以在註冊帳號的時候選擇想要的頭像(並不能自己上傳)。登入的部分還可以使用 GOOGLE 登入，如果是第一次登入會讓你填寫資料。

登入後
![](https://i.imgur.com/WdM4fUh.png)
預設的房間是 Lobby 大家都會在裡面且不能退出。然後可以開始聊天。
畫面中的寶可夢是會動(CSS 動畫)的他們代表在這個房間的人，可以將滑鼠一上去看是代表誰。

#### RWD

![](https://i.imgur.com/rCLPxTc.png)
![](https://i.imgur.com/FLs4jSJ.png)

當畫面太小會將左邊的欄位縮小到右上的按鈕。

#### 新增房間

![](https://i.imgur.com/HCDOXLl.png)
按 Lobby 上方的加號可以新增房間，也可以加入房間(只能加入公開的)
![](https://i.imgur.com/zEB6fwn.png)
右上角的按鈕分別為加別人進來，及退出房間。

#### 設定

![](https://i.imgur.com/6gowXoA.png)
右上角的設定按鈕可以設定主題顏色，及更改資料(名字和寶可夢)。還有登出。

#### Google 通知

![](https://i.imgur.com/Sj9yStu.png)
若你當前的聊天室有別人傳訊息，就會收到通知。(**請助教允許 chrome 傳送通知**)

### Function description

#### Profile Picture

我不確定是不是一定要可以上傳自己的照片，但因為我有做相關動畫所以只能選擇我提供的寶可夢們。

#### Send image

![](https://i.imgur.com/D09kKDq.png)
最上面那個是傳送圖片
![](https://i.imgur.com/xtr5iHv.png)
選定圖片後要 send。
![](https://i.imgur.com/HLiTj99.png)

#### ChatBox

我是串接 openai 的 text-davinci-003 模型。

![](https://i.imgur.com/D09kKDq.png)
使用方法是先按圖片中的 android 商標
![](https://i.imgur.com/fk64Rl2.png)
之後會變顏色。
再來在輸入框打字後傳出
![](https://i.imgur.com/Bf5tubi.png)
圖中所謂的多邊獸就是我的機器人。(因為有 TOKEN 的限制所以有時候可能會講一半)

#### Send gif from Tenor API

![](https://i.imgur.com/D09kKDq.png)
按傳送圖片下方的圖示
![](https://i.imgur.com/zKfWR3W.png)
會跳出收尋框
點擊之後就可以直接傳送出去了
![](https://i.imgur.com/g7xqr9Q.png)

### Firebase page link

[我的 Pokeroom](https://chatroom-d8254.web.app/)

### Others (Optional)

希望助教們使用 GOOGLE CHROME 可以有最好的體驗。
謝謝助教><

<style>
table th{
    width: 100%;
}
</style>
