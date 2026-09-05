/*! npmjs.com/tinyhmacmd5 */{let e=Math,r=Int32Array,n=Uint8Array,t=new r(64).map((r,n)=>2**32*e.abs(e.sin(n+1))),f=1&new n(t.buffer)[3],o=(n,f,o=0,a,l=1732584193,w=271733878,i,u,s=n.length,c=r.of(l,~w,~l,w),d=new r(c))=>{for(n[s-1]=f/2**29,n[e.floor(f/4)]|=128<<(n[s-2]=f<<3);o<s;o+=16){for(f=0;f<16;f+=4)for(a=0;a<16;)c[u&=3]=((w=c[u]+t[4*f+a]+(l=c[3&++u],w=c[3&++u],i=c[3&++u],w^(f>4?f>8?l|~i:l^i:f?i&(l^w):~l&(w^i)))+n[o+(a*(29521>>f)+(1296>>f)&15)])<<(i="',16%).4$+07&*/5".charCodeAt(3&a++|f))|w>>>32-i)+l;for(;u;)d[--u]=c[u]+=d[u]}return c},a=(t,o,a=("string"==typeof t?t=(new TextEncoder).encode(t):t).length,l=new r(o+16*e.ceil((a+9)/64)),w=f&&new n(l.buffer,4*o).set(t))=>{for(;w<a;3&++w||o++)l[o]|=t[w]<<8*w;return[l,a]};var md5=(e,t,f)=>{var l=16,w=null!=t,[i,u]=a(e,w*l),s=f?new n(l):"";if(w){let[e,n]=a(t,0),f=new r(32);for(n>64&&(e=o(e,n)),n=l;n;)f[--n]=1785358954^(i[n]=909522486^e[n]);f.set(o(i,64+u),l),i=f,u=80}for(i=o(i,u);l;f?s[l]=u:s=(u>>4&&"")+u.toString(16)+s)u=i[--l>>2]>>8*l&255;return s}}

// 清空个人资料的“学校”字段
await fetch("https:/\/community-web.ccw.site/health/check", {
  method: "POST",
  credentials: "include"
}).then(r => {
  if (!r.ok) throw Error(`${r.status} ${r.statusText}`);
  return r.json()
}).then(j => {
  if (j.status != 200) throw Error(j.msg);
  const hmacKey = j.body.reduce((p, v) => v.traceId[parseInt(v.traceId[0], 16) + 1] + p, '')
    , body = `{"school":""}`
    , b = Date["now"]().toString()
    , a = md5("ccw" + body + b, hmacKey);
  return fetch("https:/\/community-web.ccw.site/students/update", {
    method: "POST",
    credentials: "include",
    headers: { a, b, "content-type": "application/json" },
    body,
  })
})