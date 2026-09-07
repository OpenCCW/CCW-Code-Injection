// ccw oauth 创建新会话并返回 token
// ctrl+shift+i 打开 devtools ，在控制台粘贴然后 enter

// tinyhmacmd5 (The Unlicense)
{let e=Int32Array,r=Uint8Array,n=new e(64).map((e,r)=>2**32*Math.sin(++r%Math.PI)),t=(r,t,f=0,o=1732584193,a=271733878,l=e.of(o,~a,~o,a),w=r.length)=>{for(r[w-1]=t/2**29,r[(t-t%4)/4]|=128<<(r[w-2]=t<<3);f<w;f+=16){let{0:e,1:w,2:u,3:h}=l;for(t=o=0;t<16;t+=4)for(;o<4*t+16;w=0|((e+=n[o]+(u^(t>4?t>8?w|~h:w^h:t?h&(w^u):~w&(u^h)))+r[f+(o++*(29521>>t)+(1296>>t)&15)])<<a|e>>>32-a)+(e=h,h=u,u=w))a="',16%).4$+07&*/5".charCodeAt(3&o|t);l[0]+=e,l[1]+=w,l[2]+=u,l[3]+=h}return l},f=(t,f,o=("string"==typeof t?t=(new TextEncoder).encode(t):t).length,a=new e(f+18+(o-(o+8&63))/4),l=1&new r(n.buffer)[3]&&new r(a.buffer,4*f).set(t))=>{for(;l<o;3&++l||f++)a[f]|=t[l]<<8*l;return[a,o]};var md5=(n,o,a)=>{var l=16,w=null!=o,[u,h]=f(n,w*l),i=a?new r(l):"";if(w){let[r,n]=f(o,0),a=new e(32);for(n>64&&(r=t(r,n)),n=l;n;)a[--n]=1785358954^(u[n]=909522486^r[n]);a.set(t(u,64+h),l),u=a,h=80}for(u=t(u,h);l;a?i[l]=h:i=(h>>4&&"")+h.toString(16)+i)h=u[--l>>2]>>8*l&255;return i}}

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
