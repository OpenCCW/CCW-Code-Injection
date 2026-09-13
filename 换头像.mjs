// https://npmjs.com/tinyhmacmd5
{let e=Int32Array,r=Uint8Array,t=new e(64).map((e,r)=>2**32*Math.sin(++r%Math.PI)),n=1&new r(t.buffer)[0],f=e=>n?e.reverse():e,o=(r,n,f=0,o=1732584193,a=271733878,l=e.of(o,~a,~o,a),u=r.length)=>{for(r[u-1]=n/2**29,r[(n-n%4)/4]|=128<<(r[u-2]=n<<3);f<u;f+=16){let{0:e,1:u,2:w,3:d}=l;for(n=o=0;n<16;n+=4)for(let l=29521>>n,h=1296>>n;o<4*n+16;u=0|((e+=t[o]+(w^(n>4?n>8?u|~d:u^d:n?d&(u^w):~u&(w^d)))+r[f+(o++*l+h&15)])>>>a|e<<32-a)+(e=d,d=w,w=u))a="94/*;72,<50):61+".charCodeAt(3&o|n);l[0]+=e,l[1]+=u,l[2]+=w,l[3]+=d}return l},a=(t,n,o=("string"==typeof t?t=(new TextEncoder).encode(t):t).length,a=new r(n+o+72-(o+8&63)))=>[f(new e(a.buffer),a.set(t,n),f(a)),o];var md5=(t,n,l)=>{var u=null!=n,[w,d]=a(t,64*u);if(u){let[r,t]=a(n,0),f=new e(32);for(t>64&&(r=o(r,t)),t=16;t;)f[--t]=1785358954^(w[t]=909522486^r[t]);f.set(o(w,64+d),16),w=f,d=80}return u=f(new r(f(o(w,d)).buffer)),l?u:u.reduce((e,r)=>e+(r>>4&&"")+r.toString(16),"")}}

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