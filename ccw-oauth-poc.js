// ccw oauth 创建新会话并返回 token
// ctrl+shift+i 打开 devtools ，在控制台粘贴然后 enter

/*! npmjs.com/tinyhmacmd5 */{let r=Math,e=Int32Array,n=new e(64).map((e,n)=>2**32*r.abs(r.sin(n+1))),t=(t,o,f=0,a,l=1732584193,i=271733878,w,c,d=t.length,g=e.of(l,~i,~l,i),h=new e(g))=>{for(t[d-1]=o/2**29,t[r.floor(o/4)]|=128<<(t[d-2]=o<<3);f<d;f+=16){for(o=0;o<16;o+=4)for(a=0;a<16;)g[c&=3]=((i=g[c]+n[4*o+a]+(l=g[3&++c],i=g[3&++c],w=g[3&++c],o?i^(o>4?o>8?l|~w:l^w:w&(l^i)):l&i|~l&w)+t[f+(a*(29521>>o)+(1296>>o)&15)])<<(w="',16%).4$+07&*/5".charCodeAt(3&a++|o)-32)|i>>>32-w)+l;for(;c;)h[--c]=g[c]+=h[c]}return g},o=(n,t,o=("string"==typeof n?n=(new TextEncoder).encode(n):n).length,f=new e(t+16*r.ceil((o+9)/64)),a=0)=>{for(;a<o;)f[t++]=n[a++]|n[a++]<<8|n[a++]<<16|n[a++]<<24;return[f,o]};var md5=(r,n,f)=>{var a=16,l=null!=n,[i,w]=o(r,l*a),c=f?new Uint8Array(a):"";if(l){let[r,f]=o(n,0),l=new e(32);for(f>64&&(r=t(r,f)),f=a;f;)l[--f]=1785358954^(i[f]=909522486^r[f]);l.set(t(i,64+w),a),i=l,w=80}for(i=t(i,w);a;f?c[a]=w:c=(w>>4&&"")+w.toString(16)+c)w=i[--a>>2]>>8*a&255;return c}}

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
