// ccw oauth 创建新会话并返回 token
// ctrl+shift+i 打开 devtools ，在控制台粘贴然后 enter

/*! npmjs.com/tinyhmacmd5 */{let e=Int32Array,r=Uint8Array,n=new e(64).map((e,r)=>2**32*Math.abs(Math.sin(r+1))),t=1&new r(n.buffer)[3],f=(r,t,f=0,o,a=1732584193,w=271733878,l,u,h=r.length,i=e.of(a,~w,~a,w),s=new e(i))=>{for(r[h-1]=t/2**29,r[(t-t%4)/4]|=128<<(r[h-2]=t<<3);f<h;f+=16){for(t=o=0;t<16;t+=4)for(;o<4*t+16;)i[u&=3]=((w=i[u]+n[o]+(a=i[3&++u],w=i[3&++u],l=i[3&++u],w^(t>4?t>8?a|~l:a^l:t?l&(a^w):~a&(w^l)))+r[f+(o*(29521>>t)+(1296>>t)&15)])<<(l="',16%).4$+07&*/5".charCodeAt(3&o++|t))|w>>>32-l)+a;for(;u;)s[--u]=i[u]+=s[u]}return i},o=(n,f,o=("string"==typeof n?n=(new TextEncoder).encode(n):n).length,a=new e(f+18+(o-(o+8&63))/4),w=t&&new r(a.buffer,4*f).set(n))=>{for(;w<o;3&++w||f++)a[f]|=n[w]<<8*w;return[a,o]};var md5=(n,t,a)=>{var w=16,l=null!=t,[u,h]=o(n,l*w),i=a?new r(w):"";if(l){let[r,n]=o(t,0),a=new e(32);for(n>64&&(r=f(r,n)),n=w;n;)a[--n]=1785358954^(u[n]=909522486^r[n]);a.set(f(u,64+h),w),u=a,h=80}for(u=f(u,h);w;a?i[w]=h:i=(h>>4&&"")+h.toString(16)+i)h=u[--w>>2]>>8*w&255;return i}}

await(async () => {
  let hmacKey;
  const request = async (method, url, body) => {
    const headers = { "content-type": "application/json" };
    if (navigator.userAgent.includes("gandi-desktop")) try {
      // gandi desktop
      const { token, userId } = electron.ipcRenderer.sendSync("auth:get-token");
      if (token) headers.token = token;
    } catch (e) { }
    if (hmacKey && body) {
      headers.b = Date.now().toString();
      headers.a = md5("ccw" + body + headers.b, hmacKey);
    }
    const r = await fetch(url, {
      method,
      credentials: "include",
      headers,
      body,
    });
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`);
    const j = await r.json();
    if (j.status != 200) throw Error(j.msg);
    return j.body
  };
  hmacKey = await request("POST", "https://community-web.ccw.site/health/check")
    .then(body => body.reduce((p, v) => v.traceId[parseInt(v.traceId[0], 16) + 1] + p, ''));
  const encoder = new TextEncoder
    , decoder = new TextDecoder
    , bytesToHex = (bytes) => (
      bytes.toHex
        ? bytes.toHex()
        : bytes.reduce((p, v) => p + (v >> 4 && '') + v.toString(16), '')
    )
    , base64ToBytes = (
      Uint8Array.fromBase64
        ? (input) => Uint8Array.fromBase64(input)
        : (input) => Uint8Array.from(atob(input), v => v.charCodeAt())
    )
    , client_id = bytesToHex(crypto.getRandomValues(new Uint8Array(32)))
    , key = encoder.encode(client_id.slice(0, 16))
    , iv = encoder.encode("GSs0NL83MBynOzVh")
    , cipherBytes = await request("GET", `https://sso.ccw.site/oauth/authorize?state=${client_id}`)
      .then(body => base64ToBytes(body))
    , cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    )
    , code = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      cryptoKey,
      cipherBytes
    ).then(buf => decoder.decode(buf))
    , oauthBody = await request("POST", "https://sso.ccw.site/oauth/token", JSON.stringify({ code }));
  return oauthBody.token
})()
