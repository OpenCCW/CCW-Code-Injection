/*! npmjs.com/tinyhmacmd5 */{let r=Math,e=r.floor,n=Int32Array,t=new n(64).map((e,n)=>2**32*r.abs(r.sin(n+1))),o=(r,o,f=0,a,l=1732584193,w=271733878,i,d,g=r.length,h=n.of(l,~w,~l,w),s=new n(h))=>{for(r[g-1]=o/2**29,r[e(o/4)]|=128<<(r[g-2]=o<<3);f<g;f+=16){for(o=0;o<16;o+=4)for(a=0;a<16;)h[d&=3]=((w=h[d]+t[4*o|a]+(l=h[3&++d],w=h[3&++d],i=h[3&++d],o?o>4?o>8?w^(l|~i):l^w^i:l&i|w&~i:l&w|~l&i)+r[f+(a*(29521>>o)+(1296>>o)&15)])<<(i="',16%).4$+07&*/5".charCodeAt(3&a++|o))|w>>>64-i)+l;for(;d;)s[--d]=h[d]+=s[d]}return h},f=(r,t,o=("string"==typeof r?r=(new TextEncoder).encode(r):r).length,f=new n(16*e((4*t+o+72)/64)),a=0)=>{for(;a<o;)f[t++]=r[a++]|r[a++]<<8|r[a++]<<16|r[a++]<<24;return[f,o]};var md5=(r,e,t)=>{var a=16,l=null!=e,[w,i]=f(r,l*a),d=t?new Uint8Array(a):"";if(l){let[r,t]=f(e,0),l=new n(32);for(t>64&&(r=o(r,t)),t=a;t;)l[--t]=1785358954^(w[t]=909522486^r[t]);l.set(o(w,64+i),a),w=l,i=80}for(w=o(w,i);a;t?d[a]=i:d=(i>>4&&"")+i.toString(16)+d)i=w[--a>>2]>>8*a&255;return d}}

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