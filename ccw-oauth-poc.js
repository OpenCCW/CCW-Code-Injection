// ccw oauth 创建新会话并返回 token
// ctrl+shift+i 打开 devtools ，在控制台粘贴然后 enter

/*! npmjs.com/tinyhmacmd5 */{let r=Math,e=r.floor,n=Int32Array,t=new n(64).map((e,n)=>2**32*r.abs(r.sin(n+1))),o=(r,o,f=0,a,l=1732584193,w=271733878,i,d,g=r.length,h=n.of(l,~w,~l,w),s=new n(h))=>{for(r[g-1]=o/2**29,r[e(o/4)]|=128<<(r[g-2]=o<<3);f<g;f+=16){for(o=0;o<16;o+=4)for(a=0;a<16;)h[d&=3]=((w=h[d]+t[4*o|a]+(l=h[3&++d],w=h[3&++d],i=h[3&++d],o?o>4?o>8?w^(l|~i):l^w^i:l&i|w&~i:l&w|~l&i)+r[f+(a*(29521>>o)+(1296>>o)&15)])<<(i="',16%).4$+07&*/5".charCodeAt(3&a++|o))|w>>>64-i)+l;for(;d;)s[--d]=h[d]+=s[d]}return h},f=(r,t,o=("string"==typeof r?r=(new TextEncoder).encode(r):r).length,f=new n(16*e((4*t+o+72)/64)),a=0)=>{for(;a<o;)f[t++]=r[a++]|r[a++]<<8|r[a++]<<16|r[a++]<<24;return[f,o]};var md5=(r,e,t)=>{var a=16,l=null!=e,[w,i]=f(r,l*a),d=t?new Uint8Array(a):"";if(l){let[r,t]=f(e,0),l=new n(32);for(t>64&&(r=o(r,t)),t=a;t;)l[--t]=1785358954^(w[t]=909522486^r[t]);l.set(o(w,64+i),a),w=l,i=80}for(w=o(w,i);a;t?d[a]=i:d=(i>>4&&"")+i.toString(16)+d)i=w[--a>>2]>>8*a&255;return d}}

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
