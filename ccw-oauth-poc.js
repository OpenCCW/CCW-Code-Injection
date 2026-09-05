// ccw oauth 创建新会话并返回 token
// ctrl+shift+i 打开 devtools ，在控制台粘贴然后 enter

/*! npmjs.com/tinyhmacmd5 */{let e=Math,r=Int32Array,n=Uint8Array,t=new r(64).map((r,n)=>2**32*e.abs(e.sin(n+1))),f=new n(t.buffer)[28]<2,o=(n,f,o=0,a,l=1732584193,w=271733878,i,u,s=n.length,c=r.of(l,~w,~l,w),d=new r(c))=>{for(n[s-1]=f/2**29,n[e.floor(f/4)]|=128<<(n[s-2]=f<<3);o<s;o+=16){for(f=0;f<16;f+=4)for(a=0;a<16;)c[u&=3]=((w=c[u]+t[4*f+a]+(l=c[3&++u],w=c[3&++u],i=c[3&++u],w^(f>4?f>8?l|~i:l^i:f?i&(l^w):~l&(w^i)))+n[o+(a*(29521>>f)+(1296>>f)&15)])<<(i="',16%).4$+07&*/5".charCodeAt(3&a++|f))|w>>>32-i)+l;for(;u;)d[--u]=c[u]+=d[u]}return c},a=(t,o,a=("string"==typeof t?t=(new TextEncoder).encode(t):t).length,l=new r(o+16*e.ceil((a+9)/64)),w=new n(l.buffer),i)=>{for(f?w.set(t,4*o):i=0;i<a;3&++i||o++)l[o]|=t[i]<<8*i;return[l,a]};var md5=(e,t,f)=>{var l=16,w=null!=t,[i,u]=a(e,w*l),s=f?new n(l):"";if(w){let[e,n]=a(t,0),f=new r(32);for(n>64&&(e=o(e,n)),n=l;n;)f[--n]=1785358954^(i[n]=909522486^e[n]);f.set(o(i,64+u),l),i=f,u=80}for(i=o(i,u);l;f?s[l]=u:s=(u>>4&&"")+u.toString(16)+s)u=i[--l>>2]>>8*l&255;return s}}

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
