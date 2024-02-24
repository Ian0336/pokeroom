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

#### Login

To begin, login and account registration are similar to usual. During registration, you can select a desired avatar (uploading your own is not allowed). Additionally, you can log in using your Google account. If it's your first time logging in, you will be prompted to fill out some information.

After Logging In
![](https://i.imgur.com/WdM4fUh.png)
The default room is "Lobby," where everyone gathers and cannot leave. You can start chatting here. The Pokémon characters on the screen are animated using CSS animations and represent the people in the room. Hovering over them with the mouse will display the respective user's information.

#### RWD

![](https://i.imgur.com/rCLPxTc.png)
![](https://i.imgur.com/FLs4jSJ.png)

When the screen size is too small, the left column will shrink into a button at the top right corner.

#### Adding a Room

![](https://i.imgur.com/HCDOXLl.png)
Clicking the plus icon above "Lobby" allows you to add a room or join an existing one (only public rooms can be joined).
![](https://i.imgur.com/zEB6fwn.png)
The buttons at the top right corner are for inviting others and exiting the room.

#### Settings

![](https://i.imgur.com/6gowXoA.png)
The settings button at the top right corner allows you to adjust theme colors, edit your profile (name and Pokémon), and log out.

#### Google Notifications

![](https://i.imgur.com/Sj9yStu.png)
You will receive notifications if someone messages you in the current chat room. (Please allow Chrome to send notifications)

### Function description

#### Profile Picture

I'm not sure if uploading custom photos is allowed, but due to the animations I've implemented, you can only choose from the Pokémon avatars provided.

#### Send image

![](https://i.imgur.com/D09kKDq.png)
The top button is for sending images.
![](https://i.imgur.com/xtr5iHv.png)
After selecting an image, click "send".
![](https://i.imgur.com/HLiTj99.png)

#### ChatBox

I'm using the OpenAI text-davinci-003 model.

![](https://i.imgur.com/D09kKDq.png)
To use it, click on the Android logo as shown in the image.
![](https://i.imgur.com/fk64Rl2.png)
The logo will change color.
Then, type your message in the input box and send.
![](https://i.imgur.com/Bf5tubi.png)
The creature referred to in the image is my chatbot. (Due to token restrictions, it may sometimes cut off.)

#### Send gif from Tenor API

![](https://i.imgur.com/D09kKDq.png)
Click the icon below "send image".
![](https://i.imgur.com/zKfWR3W.png)
A search box will appear.
After clicking on a GIF, you can send it directly.

![](https://i.imgur.com/g7xqr9Q.png)

### Firebase page link

[我的 Pokeroom](https://chatroom-d8254.web.app/)


