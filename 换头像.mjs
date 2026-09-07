// tinyhmacmd5 (The Unlicense)
{let e=Int32Array,r=Uint8Array,n=new e(64).map((e,r)=>2**32*Math.sin(++r%Math.PI)),t=(r,t,f=0,o=1732584193,a=271733878,l=e.of(o,~a,~o,a),w=r.length)=>{for(r[w-1]=t/2**29,r[(t-t%4)/4]|=128<<(r[w-2]=t<<3);f<w;f+=16){let{0:e,1:w,2:u,3:h}=l;for(t=o=0;t<16;t+=4)for(;o<4*t+16;w=0|((e+=n[o]+(u^(t>4?t>8?w|~h:w^h:t?h&(w^u):~w&(u^h)))+r[f+(o++*(29521>>t)+(1296>>t)&15)])<<a|e>>>32-a)+(e=h,h=u,u=w))a="',16%).4$+07&*/5".charCodeAt(3&o|t);l[0]+=e,l[1]+=w,l[2]+=u,l[3]+=h}return l},f=(t,f,o=("string"==typeof t?t=(new TextEncoder).encode(t):t).length,a=new e(f+18+(o-(o+8&63))/4),l=1&new r(n.buffer)[3]&&new r(a.buffer,4*f).set(t))=>{for(;l<o;3&++l||f++)a[f]|=t[l]<<8*l;return[a,o]};var md5=(n,o,a)=>{var l=16,w=null!=o,[u,h]=f(n,w*l),i=a?new r(l):"";if(w){let[r,n]=f(o,0),a=new e(32);for(n>64&&(r=t(r,n)),n=l;n;)a[--n]=1785358954^(u[n]=909522486^r[n]);a.set(t(u,64+h),l),u=a,h=80}for(u=t(u,h);l;a?i[l]=h:i=(h>>4&&"")+h.toString(16)+i)h=u[--l>>2]>>8*l&255;return i}}

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