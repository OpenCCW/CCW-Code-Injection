// ccw oauth 创建新会话并返回 token
// ctrl+shift+i 打开 devtools ，在控制台粘贴然后 enter

// https://npmjs.com/tinyhmacmd5
{let e=Int32Array,r=Uint8Array,t=new e(64).map((e,r)=>2**32*Math.sin(++r%Math.PI)),n=1&new r(t.buffer)[0],f=e=>n?e.reverse():e,o=(r,n,f=0,o=1732584193,a=271733878,l=e.of(o,~a,~o,a),u=r.length)=>{for(r[u-1]=n/2**29,r[(n-n%4)/4]|=128<<(r[u-2]=n<<3);f<u;f+=16){let{0:e,1:u,2:w,3:d}=l;for(n=o=0;n<16;n+=4)for(let l=29521>>n,h=1296>>n;o<4*n+16;u=0|((e+=t[o]+(w^(n>4?n>8?u|~d:u^d:n?d&(u^w):~u&(w^d)))+r[f+(o++*l+h&15)])>>>a|e<<32-a)+(e=d,d=w,w=u))a="94/*;72,<50):61+".charCodeAt(3&o|n);l[0]+=e,l[1]+=u,l[2]+=w,l[3]+=d}return l},a=(t,n,o=("string"==typeof t?t=(new TextEncoder).encode(t):t).length,a=new r(n+o+72-(o+8&63)))=>[f(new e(a.buffer),a.set(t,n),f(a)),o];var md5=(t,n,l)=>{var u=null!=n,[w,d]=a(t,64*u);if(u){let[r,t]=a(n,0),f=new e(32);for(t>64&&(r=o(r,t)),t=16;t;)f[--t]=1785358954^(w[t]=909522486^r[t]);f.set(o(w,64+d),16),w=f,d=80}return u=f(new r(f(o(w,d)).buffer)),l?u:u.reduce((e,r)=>e+(r>>4&&"")+r.toString(16),"")}}

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
