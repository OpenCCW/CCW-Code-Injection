// ccw oauth 创建新会话并返回 token
// ctrl+shift+i 打开 devtools ，在控制台粘贴然后 enter

// https://npmjs.com/tinyhmacmd5
{let e=Int32Array,r=Uint8Array,n=new e(64).map((e,r)=>2**32*Math.sin(++r%Math.PI)),t=1&new r(n.buffer)[0],f=e=>e.reverse(),o=(r,t,f=0,o=1732584193,a=271733878,l=e.of(o,~a,~o,a),u=r.length)=>{for(r[u-1]=t/2**29,r[(t-t%4)/4]|=128<<(r[u-2]=t<<3);f<u;f+=16){let{0:e,1:u,2:w,3:d}=l;for(t=o=0;t<16;t+=4)for(;o<4*t+16;u=0|((e+=n[o]+(w^(t>4?t>8?u|~d:u^d:t?d&(u^w):~u&(w^d)))+r[f+(o++*(29521>>t)+(1296>>t)&15)])<<a|e>>>32-a)+(e=d,d=w,w=u))a="',16%).4$+07&*/5".charCodeAt(3&o|t);l[0]+=e,l[1]+=u,l[2]+=w,l[3]+=d}return l},a=(n,o,a=("string"==typeof n?n=(new TextEncoder).encode(n):n).length,l=new e(o+18+(a-(a+8&63))/4),u=new r(l.buffer))=>(u.set(n,4*o),t&&f(u,f(l)),[l,a]);var md5=(n,l,u)=>{var w=null!=l,[d,h]=a(n,16*w);if(w){let[r,n]=a(l,0),t=new e(32),f=16;for(n>64&&(r=o(r,n));f;)t[--f]=1785358954^(d[f]=909522486^r[f]);t.set(o(d,64+h),16),d=t,h=80}return d=o(d,h),w=new r(d.buffer),t&&f(w,f(d)),u?w:w.reduce((e,r)=>e+(r>>4&&"")+r.toString(16),"")}}

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
