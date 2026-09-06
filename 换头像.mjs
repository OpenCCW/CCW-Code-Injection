/*! npmjs.com/tinyhmacmd5 */{let e=Int32Array,r=Uint8Array,n=new e(64).map((e,r)=>2**32*Math.abs(Math.sin(r+1))),t=1&new r(n.buffer)[3],f=(r,t,f=0,o,a=1732584193,w=271733878,l,u,h=r.length,i=e.of(a,~w,~a,w),s=new e(i))=>{for(r[h-1]=t/2**29,r[(t-t%4)/4]|=128<<(r[h-2]=t<<3);f<h;f+=16){for(t=o=0;t<16;t+=4)for(;o<4*t+16;)i[u&=3]=((w=i[u]+n[o]+(a=i[3&++u],w=i[3&++u],l=i[3&++u],w^(t>4?t>8?a|~l:a^l:t?l&(a^w):~a&(w^l)))+r[f+(o*(29521>>t)+(1296>>t)&15)])<<(l="',16%).4$+07&*/5".charCodeAt(3&o++|t))|w>>>32-l)+a;for(;u;)s[--u]=i[u]+=s[u]}return i},o=(n,f,o=("string"==typeof n?n=(new TextEncoder).encode(n):n).length,a=new e(f+18+(o-(o+8&63))/4),w=t&&new r(a.buffer,4*f).set(n))=>{for(;w<o;3&++w||f++)a[f]|=n[w]<<8*w;return[a,o]};var md5=(n,t,a)=>{var w=16,l=null!=t,[u,h]=o(n,l*w),i=a?new r(w):"";if(l){let[r,n]=o(t,0),a=new e(32);for(n>64&&(r=f(r,n)),n=w;n;)a[--n]=1785358954^(u[n]=909522486^r[n]);a.set(f(u,64+h),w),u=a,h=80}for(u=f(u,h);w;a?i[w]=h:i=(h>>4&&"")+h.toString(16)+i)h=u[--w>>2]>>8*w&255;return i}}

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