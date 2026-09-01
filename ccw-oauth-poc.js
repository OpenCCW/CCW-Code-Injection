// ccw oauth 创建新会话并返回 token
// ctrl+shift+i 打开 devtools ，在控制台粘贴然后 enter

/*! npmjs.com/tinyhmacmd5 */{let r=[],n=0,t=Math,e=t.floor,o=r=>16*e((r+72)/64),f=(n,t,f=0,a=o(t),l=1732584193,c=271733878,i,d,g=[l,~c,~l,c],h=[...g])=>{for(n[a-1]=0|t/2**29,n[e(t/4)]|=128<<(n[a-2]=t<<3);f<n.length;f+=16){for(a=0;a<64;g[d&=3]=0|((c=0|g[d]+r[a]+(l=g[3&++d],c=g[3&++d],i=g[3&++d],t?t>4?t>8?c^(l|~i):l^c^i:l&i|c&~i:l&c|~l&i)+(0|n[f+(a*(29521>>t)+(1296>>t)&15)]))<<(i="',16%).4$+07&*/5".charCodeAt(3&a++|t))|c>>>64-i)+l)t=a>>4<<2;for(;d;)h[--d]=g[d]=0|h[d]+g[d]}return g},a=(r,n,t=("string"==typeof r?r=(new TextEncoder).encode(r):r).length,e=new Int32Array(o(4*n+t)),f=0)=>{for(;f<t;)e[n++]=r[f++]|r[f++]<<8|r[f++]<<16|r[f++]<<24;return[e,t]};for(var md5=(r,n,t)=>{var e=16,o=null!=n,[l,c]=a(r,o*e),i=t?new Uint8Array(e):"";if(o){let[r,t]=a(n,0),o=[];for(t>64&&(r=f(r,t)),t=e;t;)o[--t]=1785358954^(l[t]=909522486^r[t]);l=o.concat(f(l,64+c)),c=80}for(l=f(l,c);e;t?i[e]=c:i=(c>>4&&"")+c.toString(16)+i)c=l[--e>>2]>>8*e&255;return i};n<64;)r[n]=0|2**32*t.abs(t.sin(++n))}

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
