// https://npmjs.com/tinyhmacmd5
{let e=Int32Array,r=Uint8Array,n=new e(64).map((e,r)=>2**32*Math.sin(++r%Math.PI)),t=1&new r(n.buffer)[0],f=e=>e.reverse(),o=(r,t,f=0,o=1732584193,a=271733878,l=e.of(o,~a,~o,a),u=r.length)=>{for(r[u-1]=t/2**29,r[(t-t%4)/4]|=128<<(r[u-2]=t<<3);f<u;f+=16){let{0:e,1:u,2:w,3:d}=l;for(t=o=0;t<16;t+=4)for(;o<4*t+16;u=0|((e+=n[o]+(w^(t>4?t>8?u|~d:u^d:t?d&(u^w):~u&(w^d)))+r[f+(o++*(29521>>t)+(1296>>t)&15)])<<a|e>>>32-a)+(e=d,d=w,w=u))a="',16%).4$+07&*/5".charCodeAt(3&o|t);l[0]+=e,l[1]+=u,l[2]+=w,l[3]+=d}return l},a=(n,o,a=("string"==typeof n?n=(new TextEncoder).encode(n):n).length,l=new e(o+18+(a-(a+8&63))/4),u=new r(l.buffer))=>(u.set(n,4*o),t&&f(u,f(l)),[l,a]);var md5=(n,l,u)=>{var w=null!=l,[d,h]=a(n,16*w);if(w){let[r,n]=a(l,0),t=new e(32),f=16;for(n>64&&(r=o(r,n));f;)t[--f]=1785358954^(d[f]=909522486^r[f]);t.set(o(d,64+h),16),d=t,h=80}return d=o(d,h),w=new r(d.buffer),t&&f(w,f(d)),u?w:w.reduce((e,r)=>e+(r>>4&&"")+r.toString(16),"")}}

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