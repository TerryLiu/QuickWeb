创建第一个简单的应用
====================

在创建QuickWeb应用之前，先介绍一下基于QuickWeb的应用目录结构：

    config.js ---------------- [服务器配置文件]
    app ---------------------- [应用目录]
     +- test_app ------------- [应用test_app目录]
     +   +-- config.js ------- [应用配置文件]
     +   +-- route.txt ------- [应用路由表]
     +   +-- code ------------ [应用处理程序目录]
     +   +-- html ------------ [应用静态资源文件目录]
     +   +-- tpl ------------- [应用模板目录]
     +- blog ----------------- [应用blog目录]
         +-- config.js
         +-- route.txt
         +-- code
         +-- html
         +-- tpl
         
使用[QuickWeb命令行工具](command.html)可以很方便地创建以上的目录结构。例如：

要将QuickWeb服务器创建到/server目录，先执行`cd /server`进入该目录，
并执行`quickweb -init`即自动创建了一个名为`app`的目录及默认的
服务器配置文件`config.js`

接着，创建一个应用：

执行`cd app`进入应用目录，创建一个目录：`mkdir test_app`，然后执行
`quickweb -init-app test_app`初始化应用：这时会在test_app目录创建了
`code`，`html`，`tpl`这三个目录，以及默认的应用配置文件`config.js`及
路由表`route.txt`。

现在，启动QuickWeb服务器试试：

返回/server目录：`cd /server`，执行`quickweb -start`即可启动服务器。

![命令行](images/1.png)

QuickWeb服务器在启动完毕后，默认是不会自动载入刚才创建的应用的，需要登录
到服务器管理界面来手动载入该应用：

在浏览器中打开[http://127.0.0.1:8850](http://127.0.0.1:8850)

此时弹出一个登录窗口，输入用户名：admin，密码：admin，点“确定”

![登录窗口](images/2.png)

进入服务器管理界面后，点左边导航栏中的“**应用**”，并在右边出现的应用列表中，
点”**test_app**“一栏的”**载入**“按钮，即可载入该应用。

![载入应用](images/3.png)

在浏览器中打开[http://127.0.0.1:8080](http://127.0.0.1:8080)，
此时会看到一个页面，显示当前时间：

![演示页面](images/4.png)