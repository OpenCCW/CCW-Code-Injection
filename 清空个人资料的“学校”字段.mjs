/*! npmjs.com/tinyhmacmd5 */{let r=[],n=0,t=Math,e=t.floor,o=r=>16*e((r+72)/64),f=(n,t,f=0,a=o(t),l=1732584193,c=271733878,i,d,g=[l,~c,~l,c],h=[...g])=>{for(n[a-1]=0|t/2**29,n[e(t/4)]|=128<<(n[a-2]=t<<3);f<n.length;f+=16){for(a=0;a<64;g[d&=3]=0|((c=0|g[d]+r[a]+(l=g[3&++d],c=g[3&++d],i=g[3&++d],t?t>4?t>8?c^(l|~i):l^c^i:l&i|c&~i:l&c|~l&i)+(0|n[f+(a*(29521>>t)+(1296>>t)&15)]))<<(i="',16%).4$+07&*/5".charCodeAt(3&a++|t))|c>>>64-i)+l)t=a>>4<<2;for(;d;)h[--d]=g[d]=0|h[d]+g[d]}return g},a=(r,n,t=("string"==typeof r?r=(new TextEncoder).encode(r):r).length,e=new Int32Array(o(4*n+t)),f=0)=>{for(;f<t;)e[n++]=r[f++]|r[f++]<<8|r[f++]<<16|r[f++]<<24;return[e,t]};for(var md5=(r,n,t)=>{var e=16,o=null!=n,[l,c]=a(r,o*e),i=t?new Uint8Array(e):"";if(o){let[r,t]=a(n,0),o=[];for(t>64&&(r=f(r,t)),t=e;t;)o[--t]=1785358954^(l[t]=909522486^r[t]);l=o.concat(f(l,64+c)),c=80}for(l=f(l,c);e;t?i[e]=c:i=(c>>4&&"")+c.toString(16)+i)c=l[--e>>2]>>8*e&255;return i};n<64;)r[n]=0|2**32*t.abs(t.sin(++n))}

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