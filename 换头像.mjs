/*! npmjs.com/tinyhmacmd5 */{let r=Math,e=Int32Array,n=new e(64).map((e,n)=>2**32*r.abs(r.sin(n+1))),t=(t,o,f=0,a,l=1732584193,i=271733878,w,c,d=t.length,g=e.of(l,~i,~l,i),h=new e(g))=>{for(t[d-1]=o/2**29,t[r.floor(o/4)]|=128<<(t[d-2]=o<<3);f<d;f+=16){for(o=0;o<16;o+=4)for(a=0;a<16;)g[c&=3]=((i=g[c]+n[4*o+a]+(l=g[3&++c],i=g[3&++c],w=g[3&++c],o?i^(o>4?o>8?l|~w:l^w:w&(l^i)):l&i|~l&w)+t[f+(a*(29521>>o)+(1296>>o)&15)])<<(w="',16%).4$+07&*/5".charCodeAt(3&a++|o)-32)|i>>>32-w)+l;for(;c;)h[--c]=g[c]+=h[c]}return g},o=(n,t,o=("string"==typeof n?n=(new TextEncoder).encode(n):n).length,f=new e(t+16*r.ceil((o+9)/64)),a=0)=>{for(;a<o;)f[t++]=n[a++]|n[a++]<<8|n[a++]<<16|n[a++]<<24;return[f,o]};var md5=(r,n,f)=>{var a=16,l=null!=n,[i,w]=o(r,l*a),c=f?new Uint8Array(a):"";if(l){let[r,f]=o(n,0),l=new e(32);for(f>64&&(r=t(r,f)),f=a;f;)l[--f]=1785358954^(i[f]=909522486^r[f]);l.set(t(i,64+w),a),i=l,w=80}for(i=t(i,w);a;f?c[a]=w:c=(w>>4&&"")+w.toString(16)+c)w=i[--a>>2]>>8*a&255;return c}}

// 换头像
await fetch("https://community-web.ccw.site/health/check", {
  method: "POST",
  credentials: "include"
}).then(r => {
  if (!r.ok) throw Error(`${r.status} ${r.statusText}`);
  return r.json()
}).then(j => {
  if (j.status != 200) throw Error(j.msg);
  const hmacKey = j.body.reduce((p, v) => v.traceId[parseInt(v.traceId[0], 16) + 1] + p, '')
  const body = JSON.stringify({
    // 头像的文件地址，注意结尾应该有参数 ?x-oss-process=0 防止前端不渲染svg或者压缩图片
    avatar: "https://m.ccw.site/user_projects_assets/11e4d54652fe811d8ae24371393c95c2.svg?x-oss-process=0",
  })
  const b = Date["now"]().toString()
  const a = md5("ccw" + body + b, hmacKey);
  return fetch("https://community-web.ccw.site/students/update", {
    method: "POST",
    credentials: "include",
    headers: { a, b, "content-type": "application/json" },
    body,
  })
})