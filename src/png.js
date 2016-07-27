// Deflate: https://github.com/imaya/zlib.js/blob/master/bin/deflate.min.js
// @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License
(function() {'use strict';var n=void 0,w=!0,aa=this;function ba(f,d){var c=f.split("."),e=aa;!(c[0]in e)&&e.execScript&&e.execScript("var "+c[0]);for(var b;c.length&&(b=c.shift());)!c.length&&d!==n?e[b]=d:e=e[b]?e[b]:e[b]={}};var C="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==typeof DataView;function K(f,d){this.index="number"===typeof d?d:0;this.e=0;this.buffer=f instanceof(C?Uint8Array:Array)?f:new (C?Uint8Array:Array)(32768);if(2*this.buffer.length<=this.index)throw Error("invalid index");this.buffer.length<=this.index&&ca(this)}function ca(f){var d=f.buffer,c,e=d.length,b=new (C?Uint8Array:Array)(e<<1);if(C)b.set(d);else for(c=0;c<e;++c)b[c]=d[c];return f.buffer=b}
K.prototype.b=function(f,d,c){var e=this.buffer,b=this.index,a=this.e,g=e[b],m;c&&1<d&&(f=8<d?(L[f&255]<<24|L[f>>>8&255]<<16|L[f>>>16&255]<<8|L[f>>>24&255])>>32-d:L[f]>>8-d);if(8>d+a)g=g<<d|f,a+=d;else for(m=0;m<d;++m)g=g<<1|f>>d-m-1&1,8===++a&&(a=0,e[b++]=L[g],g=0,b===e.length&&(e=ca(this)));e[b]=g;this.buffer=e;this.e=a;this.index=b};K.prototype.finish=function(){var f=this.buffer,d=this.index,c;0<this.e&&(f[d]<<=8-this.e,f[d]=L[f[d]],d++);C?c=f.subarray(0,d):(f.length=d,c=f);return c};
var da=new (C?Uint8Array:Array)(256),M;for(M=0;256>M;++M){for(var N=M,S=N,ea=7,N=N>>>1;N;N>>>=1)S<<=1,S|=N&1,--ea;da[M]=(S<<ea&255)>>>0}var L=da;function ia(f){this.buffer=new (C?Uint16Array:Array)(2*f);this.length=0}ia.prototype.getParent=function(f){return 2*((f-2)/4|0)};ia.prototype.push=function(f,d){var c,e,b=this.buffer,a;c=this.length;b[this.length++]=d;for(b[this.length++]=f;0<c;)if(e=this.getParent(c),b[c]>b[e])a=b[c],b[c]=b[e],b[e]=a,a=b[c+1],b[c+1]=b[e+1],b[e+1]=a,c=e;else break;return this.length};
ia.prototype.pop=function(){var f,d,c=this.buffer,e,b,a;d=c[0];f=c[1];this.length-=2;c[0]=c[this.length];c[1]=c[this.length+1];for(a=0;;){b=2*a+2;if(b>=this.length)break;b+2<this.length&&c[b+2]>c[b]&&(b+=2);if(c[b]>c[a])e=c[a],c[a]=c[b],c[b]=e,e=c[a+1],c[a+1]=c[b+1],c[b+1]=e;else break;a=b}return{index:f,value:d,length:this.length}};function ka(f,d){this.d=la;this.i=0;this.input=C&&f instanceof Array?new Uint8Array(f):f;this.c=0;d&&(d.lazy&&(this.i=d.lazy),"number"===typeof d.compressionType&&(this.d=d.compressionType),d.outputBuffer&&(this.a=C&&d.outputBuffer instanceof Array?new Uint8Array(d.outputBuffer):d.outputBuffer),"number"===typeof d.outputIndex&&(this.c=d.outputIndex));this.a||(this.a=new (C?Uint8Array:Array)(32768))}var la=2,na={NONE:0,h:1,g:la,n:3},T=[],U;
for(U=0;288>U;U++)switch(w){case 143>=U:T.push([U+48,8]);break;case 255>=U:T.push([U-144+400,9]);break;case 279>=U:T.push([U-256+0,7]);break;case 287>=U:T.push([U-280+192,8]);break;default:throw"invalid literal: "+U;}
ka.prototype.f=function(){var f,d,c,e,b=this.input;switch(this.d){case 0:c=0;for(e=b.length;c<e;){d=C?b.subarray(c,c+65535):b.slice(c,c+65535);c+=d.length;var a=d,g=c===e,m=n,k=n,p=n,t=n,u=n,l=this.a,h=this.c;if(C){for(l=new Uint8Array(this.a.buffer);l.length<=h+a.length+5;)l=new Uint8Array(l.length<<1);l.set(this.a)}m=g?1:0;l[h++]=m|0;k=a.length;p=~k+65536&65535;l[h++]=k&255;l[h++]=k>>>8&255;l[h++]=p&255;l[h++]=p>>>8&255;if(C)l.set(a,h),h+=a.length,l=l.subarray(0,h);else{t=0;for(u=a.length;t<u;++t)l[h++]=
a[t];l.length=h}this.c=h;this.a=l}break;case 1:var q=new K(C?new Uint8Array(this.a.buffer):this.a,this.c);q.b(1,1,w);q.b(1,2,w);var s=oa(this,b),x,fa,z;x=0;for(fa=s.length;x<fa;x++)if(z=s[x],K.prototype.b.apply(q,T[z]),256<z)q.b(s[++x],s[++x],w),q.b(s[++x],5),q.b(s[++x],s[++x],w);else if(256===z)break;this.a=q.finish();this.c=this.a.length;break;case la:var B=new K(C?new Uint8Array(this.a.buffer):this.a,this.c),ta,J,O,P,Q,La=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],X,ua,Y,va,ga,ja=Array(19),
wa,R,ha,y,xa;ta=la;B.b(1,1,w);B.b(ta,2,w);J=oa(this,b);X=pa(this.m,15);ua=qa(X);Y=pa(this.l,7);va=qa(Y);for(O=286;257<O&&0===X[O-1];O--);for(P=30;1<P&&0===Y[P-1];P--);var ya=O,za=P,F=new (C?Uint32Array:Array)(ya+za),r,G,v,Z,E=new (C?Uint32Array:Array)(316),D,A,H=new (C?Uint8Array:Array)(19);for(r=G=0;r<ya;r++)F[G++]=X[r];for(r=0;r<za;r++)F[G++]=Y[r];if(!C){r=0;for(Z=H.length;r<Z;++r)H[r]=0}r=D=0;for(Z=F.length;r<Z;r+=G){for(G=1;r+G<Z&&F[r+G]===F[r];++G);v=G;if(0===F[r])if(3>v)for(;0<v--;)E[D++]=0,
H[0]++;else for(;0<v;)A=138>v?v:138,A>v-3&&A<v&&(A=v-3),10>=A?(E[D++]=17,E[D++]=A-3,H[17]++):(E[D++]=18,E[D++]=A-11,H[18]++),v-=A;else if(E[D++]=F[r],H[F[r]]++,v--,3>v)for(;0<v--;)E[D++]=F[r],H[F[r]]++;else for(;0<v;)A=6>v?v:6,A>v-3&&A<v&&(A=v-3),E[D++]=16,E[D++]=A-3,H[16]++,v-=A}f=C?E.subarray(0,D):E.slice(0,D);ga=pa(H,7);for(y=0;19>y;y++)ja[y]=ga[La[y]];for(Q=19;4<Q&&0===ja[Q-1];Q--);wa=qa(ga);B.b(O-257,5,w);B.b(P-1,5,w);B.b(Q-4,4,w);for(y=0;y<Q;y++)B.b(ja[y],3,w);y=0;for(xa=f.length;y<xa;y++)if(R=
f[y],B.b(wa[R],ga[R],w),16<=R){y++;switch(R){case 16:ha=2;break;case 17:ha=3;break;case 18:ha=7;break;default:throw"invalid code: "+R;}B.b(f[y],ha,w)}var Aa=[ua,X],Ba=[va,Y],I,Ca,$,ma,Da,Ea,Fa,Ga;Da=Aa[0];Ea=Aa[1];Fa=Ba[0];Ga=Ba[1];I=0;for(Ca=J.length;I<Ca;++I)if($=J[I],B.b(Da[$],Ea[$],w),256<$)B.b(J[++I],J[++I],w),ma=J[++I],B.b(Fa[ma],Ga[ma],w),B.b(J[++I],J[++I],w);else if(256===$)break;this.a=B.finish();this.c=this.a.length;break;default:throw"invalid compression type";}return this.a};
function ra(f,d){this.length=f;this.k=d}
var sa=function(){function f(b){switch(w){case 3===b:return[257,b-3,0];case 4===b:return[258,b-4,0];case 5===b:return[259,b-5,0];case 6===b:return[260,b-6,0];case 7===b:return[261,b-7,0];case 8===b:return[262,b-8,0];case 9===b:return[263,b-9,0];case 10===b:return[264,b-10,0];case 12>=b:return[265,b-11,1];case 14>=b:return[266,b-13,1];case 16>=b:return[267,b-15,1];case 18>=b:return[268,b-17,1];case 22>=b:return[269,b-19,2];case 26>=b:return[270,b-23,2];case 30>=b:return[271,b-27,2];case 34>=b:return[272,
b-31,2];case 42>=b:return[273,b-35,3];case 50>=b:return[274,b-43,3];case 58>=b:return[275,b-51,3];case 66>=b:return[276,b-59,3];case 82>=b:return[277,b-67,4];case 98>=b:return[278,b-83,4];case 114>=b:return[279,b-99,4];case 130>=b:return[280,b-115,4];case 162>=b:return[281,b-131,5];case 194>=b:return[282,b-163,5];case 226>=b:return[283,b-195,5];case 257>=b:return[284,b-227,5];case 258===b:return[285,b-258,0];default:throw"invalid length: "+b;}}var d=[],c,e;for(c=3;258>=c;c++)e=f(c),d[c]=e[2]<<24|
e[1]<<16|e[0];return d}(),Ha=C?new Uint32Array(sa):sa;
function oa(f,d){function c(b,c){var a=b.k,d=[],e=0,f;f=Ha[b.length];d[e++]=f&65535;d[e++]=f>>16&255;d[e++]=f>>24;var g;switch(w){case 1===a:g=[0,a-1,0];break;case 2===a:g=[1,a-2,0];break;case 3===a:g=[2,a-3,0];break;case 4===a:g=[3,a-4,0];break;case 6>=a:g=[4,a-5,1];break;case 8>=a:g=[5,a-7,1];break;case 12>=a:g=[6,a-9,2];break;case 16>=a:g=[7,a-13,2];break;case 24>=a:g=[8,a-17,3];break;case 32>=a:g=[9,a-25,3];break;case 48>=a:g=[10,a-33,4];break;case 64>=a:g=[11,a-49,4];break;case 96>=a:g=[12,a-
65,5];break;case 128>=a:g=[13,a-97,5];break;case 192>=a:g=[14,a-129,6];break;case 256>=a:g=[15,a-193,6];break;case 384>=a:g=[16,a-257,7];break;case 512>=a:g=[17,a-385,7];break;case 768>=a:g=[18,a-513,8];break;case 1024>=a:g=[19,a-769,8];break;case 1536>=a:g=[20,a-1025,9];break;case 2048>=a:g=[21,a-1537,9];break;case 3072>=a:g=[22,a-2049,10];break;case 4096>=a:g=[23,a-3073,10];break;case 6144>=a:g=[24,a-4097,11];break;case 8192>=a:g=[25,a-6145,11];break;case 12288>=a:g=[26,a-8193,12];break;case 16384>=
a:g=[27,a-12289,12];break;case 24576>=a:g=[28,a-16385,13];break;case 32768>=a:g=[29,a-24577,13];break;default:throw"invalid distance";}f=g;d[e++]=f[0];d[e++]=f[1];d[e++]=f[2];var k,m;k=0;for(m=d.length;k<m;++k)l[h++]=d[k];s[d[0]]++;x[d[3]]++;q=b.length+c-1;u=null}var e,b,a,g,m,k={},p,t,u,l=C?new Uint16Array(2*d.length):[],h=0,q=0,s=new (C?Uint32Array:Array)(286),x=new (C?Uint32Array:Array)(30),fa=f.i,z;if(!C){for(a=0;285>=a;)s[a++]=0;for(a=0;29>=a;)x[a++]=0}s[256]=1;e=0;for(b=d.length;e<b;++e){a=
m=0;for(g=3;a<g&&e+a!==b;++a)m=m<<8|d[e+a];k[m]===n&&(k[m]=[]);p=k[m];if(!(0<q--)){for(;0<p.length&&32768<e-p[0];)p.shift();if(e+3>=b){u&&c(u,-1);a=0;for(g=b-e;a<g;++a)z=d[e+a],l[h++]=z,++s[z];break}0<p.length?(t=Ia(d,e,p),u?u.length<t.length?(z=d[e-1],l[h++]=z,++s[z],c(t,0)):c(u,-1):t.length<fa?u=t:c(t,0)):u?c(u,-1):(z=d[e],l[h++]=z,++s[z])}p.push(e)}l[h++]=256;s[256]++;f.m=s;f.l=x;return C?l.subarray(0,h):l}
function Ia(f,d,c){var e,b,a=0,g,m,k,p,t=f.length;m=0;p=c.length;a:for(;m<p;m++){e=c[p-m-1];g=3;if(3<a){for(k=a;3<k;k--)if(f[e+k-1]!==f[d+k-1])continue a;g=a}for(;258>g&&d+g<t&&f[e+g]===f[d+g];)++g;g>a&&(b=e,a=g);if(258===g)break}return new ra(a,d-b)}
function pa(f,d){var c=f.length,e=new ia(572),b=new (C?Uint8Array:Array)(c),a,g,m,k,p;if(!C)for(k=0;k<c;k++)b[k]=0;for(k=0;k<c;++k)0<f[k]&&e.push(k,f[k]);a=Array(e.length/2);g=new (C?Uint32Array:Array)(e.length/2);if(1===a.length)return b[e.pop().index]=1,b;k=0;for(p=e.length/2;k<p;++k)a[k]=e.pop(),g[k]=a[k].value;m=Ja(g,g.length,d);k=0;for(p=a.length;k<p;++k)b[a[k].index]=m[k];return b}
function Ja(f,d,c){function e(a){var b=k[a][p[a]];b===d?(e(a+1),e(a+1)):--g[b];++p[a]}var b=new (C?Uint16Array:Array)(c),a=new (C?Uint8Array:Array)(c),g=new (C?Uint8Array:Array)(d),m=Array(c),k=Array(c),p=Array(c),t=(1<<c)-d,u=1<<c-1,l,h,q,s,x;b[c-1]=d;for(h=0;h<c;++h)t<u?a[h]=0:(a[h]=1,t-=u),t<<=1,b[c-2-h]=(b[c-1-h]/2|0)+d;b[0]=a[0];m[0]=Array(b[0]);k[0]=Array(b[0]);for(h=1;h<c;++h)b[h]>2*b[h-1]+a[h]&&(b[h]=2*b[h-1]+a[h]),m[h]=Array(b[h]),k[h]=Array(b[h]);for(l=0;l<d;++l)g[l]=c;for(q=0;q<b[c-1];++q)m[c-
1][q]=f[q],k[c-1][q]=q;for(l=0;l<c;++l)p[l]=0;1===a[c-1]&&(--g[0],++p[c-1]);for(h=c-2;0<=h;--h){s=l=0;x=p[h+1];for(q=0;q<b[h];q++)s=m[h+1][x]+m[h+1][x+1],s>f[l]?(m[h][q]=s,k[h][q]=d,x+=2):(m[h][q]=f[l],k[h][q]=l,++l);p[h]=0;1===a[h]&&e(h)}return g}
function qa(f){var d=new (C?Uint16Array:Array)(f.length),c=[],e=[],b=0,a,g,m,k;a=0;for(g=f.length;a<g;a++)c[f[a]]=(c[f[a]]|0)+1;a=1;for(g=16;a<=g;a++)e[a]=b,b+=c[a]|0,b<<=1;a=0;for(g=f.length;a<g;a++){b=e[f[a]];e[f[a]]+=1;m=d[a]=0;for(k=f[a];m<k;m++)d[a]=d[a]<<1|b&1,b>>>=1}return d};function Ka(f,d){this.input=f;this.a=new (C?Uint8Array:Array)(32768);this.d=V.g;var c={},e;if((d||!(d={}))&&"number"===typeof d.compressionType)this.d=d.compressionType;for(e in d)c[e]=d[e];c.outputBuffer=this.a;this.j=new ka(this.input,c)}var V=na;
Ka.prototype.f=function(){var f,d,c,e,b,a,g=0;a=this.a;switch(8){case 8:f=Math.LOG2E*Math.log(32768)-8;break;default:throw Error("invalid compression method");}d=f<<4|8;a[g++]=d;switch(8){case 8:switch(this.d){case V.NONE:e=0;break;case V.h:e=1;break;case V.g:e=2;break;default:throw Error("unsupported compression type");}break;default:throw Error("invalid compression method");}c=e<<6|0;a[g++]=c|31-(256*d+c)%31;var m=this.input;if("string"===typeof m){var k=m.split(""),p,t;p=0;for(t=k.length;p<t;p++)k[p]=
(k[p].charCodeAt(0)&255)>>>0;m=k}for(var u=1,l=0,h=m.length,q,s=0;0<h;){q=1024<h?1024:h;h-=q;do u+=m[s++],l+=u;while(--q);u%=65521;l%=65521}b=(l<<16|u)>>>0;this.j.c=g;a=this.j.f();g=a.length;C&&(a=new Uint8Array(a.buffer),a.length<=g+4&&(this.a=new Uint8Array(a.length+4),this.a.set(a),a=this.a),a=a.subarray(0,g+4));a[g++]=b>>24&255;a[g++]=b>>16&255;a[g++]=b>>8&255;a[g++]=b&255;return a};ba("Zlib.Deflate",Ka);ba("Zlib.Deflate.compress",function(f,d){return(new Ka(f,d)).f()});ba("Zlib.Deflate.prototype.compress",Ka.prototype.f);var Ma={NONE:V.NONE,FIXED:V.h,DYNAMIC:V.g},Na,Oa,W,Pa;if(Object.keys)Na=Object.keys(Ma);else for(Oa in Na=[],W=0,Ma)Na[W++]=Oa;W=0;for(Pa=Na.length;W<Pa;++W)Oa=Na[W],ba("Zlib.Deflate.CompressionType."+Oa,Ma[Oa]);}).call(this); //@ sourceMappingURL=deflate.min.js.map


// Inflate: https://github.com/imaya/zlib.js/blob/master/bin/inflate.min.js
// @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License
(function() {'use strict';var m=this;function q(c,d){var a=c.split("."),b=m;!(a[0]in b)&&b.execScript&&b.execScript("var "+a[0]);for(var e;a.length&&(e=a.shift());)!a.length&&void 0!==d?b[e]=d:b=b[e]?b[e]:b[e]={}};var s="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array&&"undefined"!==typeof DataView;function t(c){var d=c.length,a=0,b=Number.POSITIVE_INFINITY,e,f,g,h,k,l,p,n,r,K;for(n=0;n<d;++n)c[n]>a&&(a=c[n]),c[n]<b&&(b=c[n]);e=1<<a;f=new (s?Uint32Array:Array)(e);g=1;h=0;for(k=2;g<=a;){for(n=0;n<d;++n)if(c[n]===g){l=0;p=h;for(r=0;r<g;++r)l=l<<1|p&1,p>>=1;K=g<<16|n;for(r=l;r<e;r+=k)f[r]=K;++h}++g;h<<=1;k<<=1}return[f,a,b]};function u(c,d){this.g=[];this.h=32768;this.d=this.f=this.a=this.l=0;this.input=s?new Uint8Array(c):c;this.m=!1;this.i=v;this.s=!1;if(d||!(d={}))d.index&&(this.a=d.index),d.bufferSize&&(this.h=d.bufferSize),d.bufferType&&(this.i=d.bufferType),d.resize&&(this.s=d.resize);switch(this.i){case w:this.b=32768;this.c=new (s?Uint8Array:Array)(32768+this.h+258);break;case v:this.b=0;this.c=new (s?Uint8Array:Array)(this.h);this.e=this.A;this.n=this.w;this.j=this.z;break;default:throw Error("invalid inflate mode");
}}var w=0,v=1,x={u:w,t:v};
u.prototype.k=function(){for(;!this.m;){var c=y(this,3);c&1&&(this.m=!0);c>>>=1;switch(c){case 0:var d=this.input,a=this.a,b=this.c,e=this.b,f=d.length,g=void 0,h=void 0,k=b.length,l=void 0;this.d=this.f=0;if(a+1>=f)throw Error("invalid uncompressed block header: LEN");g=d[a++]|d[a++]<<8;if(a+1>=f)throw Error("invalid uncompressed block header: NLEN");h=d[a++]|d[a++]<<8;if(g===~h)throw Error("invalid uncompressed block header: length verify");if(a+g>d.length)throw Error("input buffer is broken");switch(this.i){case w:for(;e+
g>b.length;){l=k-e;g-=l;if(s)b.set(d.subarray(a,a+l),e),e+=l,a+=l;else for(;l--;)b[e++]=d[a++];this.b=e;b=this.e();e=this.b}break;case v:for(;e+g>b.length;)b=this.e({p:2});break;default:throw Error("invalid inflate mode");}if(s)b.set(d.subarray(a,a+g),e),e+=g,a+=g;else for(;g--;)b[e++]=d[a++];this.a=a;this.b=e;this.c=b;break;case 1:this.j(z,A);break;case 2:B(this);break;default:throw Error("unknown BTYPE: "+c);}}return this.n()};
var C=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],D=s?new Uint16Array(C):C,E=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],F=s?new Uint16Array(E):E,G=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],H=s?new Uint8Array(G):G,I=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],J=s?new Uint16Array(I):I,L=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,
13],M=s?new Uint8Array(L):L,N=new (s?Uint8Array:Array)(288),O,P;O=0;for(P=N.length;O<P;++O)N[O]=143>=O?8:255>=O?9:279>=O?7:8;var z=t(N),Q=new (s?Uint8Array:Array)(30),R,S;R=0;for(S=Q.length;R<S;++R)Q[R]=5;var A=t(Q);function y(c,d){for(var a=c.f,b=c.d,e=c.input,f=c.a,g=e.length,h;b<d;){if(f>=g)throw Error("input buffer is broken");a|=e[f++]<<b;b+=8}h=a&(1<<d)-1;c.f=a>>>d;c.d=b-d;c.a=f;return h}
function T(c,d){for(var a=c.f,b=c.d,e=c.input,f=c.a,g=e.length,h=d[0],k=d[1],l,p;b<k&&!(f>=g);)a|=e[f++]<<b,b+=8;l=h[a&(1<<k)-1];p=l>>>16;c.f=a>>p;c.d=b-p;c.a=f;return l&65535}
function B(c){function d(a,c,b){var d,e=this.q,f,g;for(g=0;g<a;)switch(d=T(this,c),d){case 16:for(f=3+y(this,2);f--;)b[g++]=e;break;case 17:for(f=3+y(this,3);f--;)b[g++]=0;e=0;break;case 18:for(f=11+y(this,7);f--;)b[g++]=0;e=0;break;default:e=b[g++]=d}this.q=e;return b}var a=y(c,5)+257,b=y(c,5)+1,e=y(c,4)+4,f=new (s?Uint8Array:Array)(D.length),g,h,k,l;for(l=0;l<e;++l)f[D[l]]=y(c,3);if(!s){l=e;for(e=f.length;l<e;++l)f[D[l]]=0}g=t(f);h=new (s?Uint8Array:Array)(a);k=new (s?Uint8Array:Array)(b);c.q=0;
c.j(t(d.call(c,a,g,h)),t(d.call(c,b,g,k)))}u.prototype.j=function(c,d){var a=this.c,b=this.b;this.o=c;for(var e=a.length-258,f,g,h,k;256!==(f=T(this,c));)if(256>f)b>=e&&(this.b=b,a=this.e(),b=this.b),a[b++]=f;else{g=f-257;k=F[g];0<H[g]&&(k+=y(this,H[g]));f=T(this,d);h=J[f];0<M[f]&&(h+=y(this,M[f]));b>=e&&(this.b=b,a=this.e(),b=this.b);for(;k--;)a[b]=a[b++-h]}for(;8<=this.d;)this.d-=8,this.a--;this.b=b};
u.prototype.z=function(c,d){var a=this.c,b=this.b;this.o=c;for(var e=a.length,f,g,h,k;256!==(f=T(this,c));)if(256>f)b>=e&&(a=this.e(),e=a.length),a[b++]=f;else{g=f-257;k=F[g];0<H[g]&&(k+=y(this,H[g]));f=T(this,d);h=J[f];0<M[f]&&(h+=y(this,M[f]));b+k>e&&(a=this.e(),e=a.length);for(;k--;)a[b]=a[b++-h]}for(;8<=this.d;)this.d-=8,this.a--;this.b=b};
u.prototype.e=function(){var c=new (s?Uint8Array:Array)(this.b-32768),d=this.b-32768,a,b,e=this.c;if(s)c.set(e.subarray(32768,c.length));else{a=0;for(b=c.length;a<b;++a)c[a]=e[a+32768]}this.g.push(c);this.l+=c.length;if(s)e.set(e.subarray(d,d+32768));else for(a=0;32768>a;++a)e[a]=e[d+a];this.b=32768;return e};
u.prototype.A=function(c){var d,a=this.input.length/this.a+1|0,b,e,f,g=this.input,h=this.c;c&&("number"===typeof c.p&&(a=c.p),"number"===typeof c.v&&(a+=c.v));2>a?(b=(g.length-this.a)/this.o[2],f=258*(b/2)|0,e=f<h.length?h.length+f:h.length<<1):e=h.length*a;s?(d=new Uint8Array(e),d.set(h)):d=h;return this.c=d};
u.prototype.n=function(){var c=0,d=this.c,a=this.g,b,e=new (s?Uint8Array:Array)(this.l+(this.b-32768)),f,g,h,k;if(0===a.length)return s?this.c.subarray(32768,this.b):this.c.slice(32768,this.b);f=0;for(g=a.length;f<g;++f){b=a[f];h=0;for(k=b.length;h<k;++h)e[c++]=b[h]}f=32768;for(g=this.b;f<g;++f)e[c++]=d[f];this.g=[];return this.buffer=e};
u.prototype.w=function(){var c,d=this.b;s?this.s?(c=new Uint8Array(d),c.set(this.c.subarray(0,d))):c=this.c.subarray(0,d):(this.c.length>d&&(this.c.length=d),c=this.c);return this.buffer=c};function U(c,d){var a,b;this.input=c;this.a=0;if(d||!(d={}))d.index&&(this.a=d.index),d.verify&&(this.B=d.verify);a=c[this.a++];b=c[this.a++];switch(a&15){case V:this.method=V;break;default:throw Error("unsupported compression method");}if(0!==((a<<8)+b)%31)throw Error("invalid fcheck flag:"+((a<<8)+b)%31);if(b&32)throw Error("fdict flag is not supported");this.r=new u(c,{index:this.a,bufferSize:d.bufferSize,bufferType:d.bufferType,resize:d.resize})}
U.prototype.k=function(){var c=this.input,d,a;d=this.r.k();this.a=this.r.a;if(this.B){a=(c[this.a++]<<24|c[this.a++]<<16|c[this.a++]<<8|c[this.a++])>>>0;var b=d;if("string"===typeof b){var e=b.split(""),f,g;f=0;for(g=e.length;f<g;f++)e[f]=(e[f].charCodeAt(0)&255)>>>0;b=e}for(var h=1,k=0,l=b.length,p,n=0;0<l;){p=1024<l?1024:l;l-=p;do h+=b[n++],k+=h;while(--p);h%=65521;k%=65521}if(a!==(k<<16|h)>>>0)throw Error("invalid adler-32 checksum");}return d};var V=8;q("Zlib.Inflate",U);q("Zlib.Inflate.prototype.decompress",U.prototype.k);var W={ADAPTIVE:x.t,BLOCK:x.u},X,Y,Z,$;if(Object.keys)X=Object.keys(W);else for(Y in X=[],Z=0,W)X[Z++]=Y;Z=0;for($=X.length;Z<$;++Z)Y=X[Z],q("Zlib.Inflate.BufferType."+Y,W[Y]);}).call(this); //@ sourceMappingURL=inflate.min.js.map



// PNG: https://github.com/devongovett/png.js/blob/master/png.js

// Generated by CoffeeScript 1.4.0

// # MIT LICENSE
// # Copyright (c) 2011 Devon Govett
// # 
// # Permission is hereby granted, free of charge, to any person obtaining a copy of this 
// # software and associated documentation files (the "Software"), to deal in the Software 
// # without restriction, including without limitation the rights to use, copy, modify, merge, 
// # publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
// # to whom the Software is furnished to do so, subject to the following conditions:
// # 
// # The above copyright notice and this permission notice shall be included in all copies or 
// # substantial portions of the Software.
// # 
// # THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
// # BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// # NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
// # DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// # OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



(function() {
  var PNG;

  PNG = (function() {
    var APNG_BLEND_OP_OVER, APNG_BLEND_OP_SOURCE, APNG_DISPOSE_OP_BACKGROUND, APNG_DISPOSE_OP_NONE, APNG_DISPOSE_OP_PREVIOUS, makeImage, scratchCanvas, scratchCtx;

    APNG_DISPOSE_OP_NONE = 0;
    APNG_DISPOSE_OP_BACKGROUND = 1;
    APNG_DISPOSE_OP_PREVIOUS = 2;
    
    APNG_BLEND_OP_SOURCE = 0;
    APNG_BLEND_OP_OVER = 1;

    function PNG(data) {
      var chunkSize, colors, delayDen, delayNum, frame, i, index, key, section, short, text, _i, _j, _ref;
      this.data = data;
      this.pos = 8;
      this.palette = [];
      this.imgData = [];
      this.transparency = {};
      this.animation = null;
      this.text = {};
      frame = null;
      while (true) {
        chunkSize = this.readUInt32();
        section = ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < 4; i = ++_i) {
            _results.push(String.fromCharCode(this.data[this.pos++]));
          }
          return _results;
        }).call(this)).join('');
        switch (section) {
          case 'IHDR':
            this.width = this.readUInt32();
            this.height = this.readUInt32();
            this.bits = this.data[this.pos++];
            this.colorType = this.data[this.pos++];
            this.compressionMethod = this.data[this.pos++];
            this.filterMethod = this.data[this.pos++];
            this.interlaceMethod = this.data[this.pos++];
            break;
          case 'acTL':
            this.animation = {
              numFrames: this.readUInt32(),
              numPlays: this.readUInt32() || Infinity,
              frames: []
            };
            break;
          case 'PLTE':
            this.palette = this.read(chunkSize);
            break;
          case 'fcTL':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.pos += 4;
            frame = {
              width: this.readUInt32(),
              height: this.readUInt32(),
              xOffset: this.readUInt32(),
              yOffset: this.readUInt32()
            };
            delayNum = this.readUInt16();
            delayDen = this.readUInt16() || 100;
            frame.delay = 1000 * delayNum / delayDen;
            frame.disposeOp = this.data[this.pos++];
            frame.blendOp = this.data[this.pos++];
            frame.data = [];
            break;
          case 'IDAT':
          case 'fdAT':
            if (section === 'fdAT') {
              this.pos += 4;
              chunkSize -= 4;
            }
            data = (frame != null ? frame.data : void 0) || this.imgData;
            for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
              data.push(this.data[this.pos++]);
            }
            break;
          case 'tRNS':
            this.transparency = {};
            switch (this.colorType) {
              case 3:
                this.transparency.indexed = this.read(chunkSize);
                short = 255 - this.transparency.indexed.length;
                if (short > 0) {
                  for (i = _j = 0; 0 <= short ? _j < short : _j > short; i = 0 <= short ? ++_j : --_j) {
                    this.transparency.indexed.push(255);
                  }
                }
                break;
              case 0:
                this.transparency.grayscale = this.read(chunkSize)[0];
                break;
              case 2:
                this.transparency.rgb = this.read(chunkSize);
            }
            break;
          case 'tEXt':
            text = this.read(chunkSize);
            index = text.indexOf(0);
            key = String.fromCharCode.apply(String, text.slice(0, index));
            this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
            break;
          case 'IEND':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.colors = (function() {
              switch (this.colorType) {
                case 0:
                case 3:
                case 4:
                  return 1;
                case 2:
                case 6:
                  return 3;
              }
            }).call(this);
            this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
            colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
            this.pixelBitlength = this.bits * colors;
            this.colorSpace = (function() {
              switch (this.colors) {
                case 1:
                  return 'DeviceGray';
                case 3:
                  return 'DeviceRGB';
              }
            }).call(this);
            this.imgData = new Uint8Array(this.imgData);
            return;
          default:
            this.pos += chunkSize;
        }
        this.pos += 4;
        if (this.pos > this.data.length) {
          throw new Error("Incomplete or corrupt PNG file");
        }
      }
      return;
    }

    PNG.prototype.read = function(bytes) {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
        _results.push(this.data[this.pos++]);
      }
      return _results;
    };

    PNG.prototype.readUInt32 = function() {
      var b1, b2, b3, b4;
      b1 = this.data[this.pos++] << 24;
      b2 = this.data[this.pos++] << 16;
      b3 = this.data[this.pos++] << 8;
      b4 = this.data[this.pos++];
      return b1 | b2 | b3 | b4;
    };

    PNG.prototype.readUInt16 = function() {
      var b1, b2;
      b1 = this.data[this.pos++] << 8;
      b2 = this.data[this.pos++];
      return b1 | b2;
    };

    PNG.prototype.decodePixels = function(data) {
      var byte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
      if (data == null) {
        data = this.imgData;
      }
      if (data.length === 0) {
        return new Uint8Array(0);
      }
      data = new Zlib.Inflate(data).decompress();
      pixelBytes = this.pixelBitlength / 8;
      scanlineLength = pixelBytes * this.width;
      pixels = new Uint8Array(scanlineLength * this.height);
      length = data.length;
      row = 0;
      pos = 0;
      c = 0;
      while (pos < length) {
        switch (data[pos++]) {
          case 0:
            for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
              pixels[c++] = data[pos++];
            }
            break;
          case 1:
            for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
              byte = data[pos++];
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              pixels[c++] = (byte + left) % 256;
            }
            break;
          case 2:
            for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
              byte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (upper + byte) % 256;
            }
            break;
          case 3:
            for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
              byte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
            }
            break;
          case 4:
            for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
              byte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              if (row === 0) {
                upper = upperLeft = 0;
              } else {
                upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
              }
              p = left + upper - upperLeft;
              pa = Math.abs(p - left);
              pb = Math.abs(p - upper);
              pc = Math.abs(p - upperLeft);
              if (pa <= pb && pa <= pc) {
                paeth = left;
              } else if (pb <= pc) {
                paeth = upper;
              } else {
                paeth = upperLeft;
              }
              pixels[c++] = (byte + paeth) % 256;
            }
            break;
          default:
            throw new Error("Invalid filter algorithm: " + data[pos - 1]);
        }
        row++;
      }
      return pixels;
    };

    PNG.prototype.decodePalette = function() {
      var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
      palette = this.palette;
      transparency = this.transparency.indexed || [];
      ret = new Uint8Array((transparency.length || 0) + palette.length);
      pos = 0;
      length = palette.length;
      c = 0;
      for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
        ret[pos++] = palette[i];
        ret[pos++] = palette[i + 1];
        ret[pos++] = palette[i + 2];
        ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
      }
      return ret;
    };

    PNG.prototype.copyToImageData = function(imageData, pixels) {
      var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
      colors = this.colors;
      palette = null;
      alpha = this.hasAlphaChannel;
      if (this.palette.length) {
        palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
        colors = 4;
        alpha = true;
      }
      data = imageData.data || imageData;
      length = data.length;
      input = palette || pixels;
      i = j = 0;
      if (colors === 1) {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          v = input[k++];
          data[i++] = v;
          data[i++] = v;
          data[i++] = v;
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      } else {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      }
    };

    PNG.prototype.decode = function() {
      var ret;
      ret = new Uint8Array(this.width * this.height * 4);
      this.copyToImageData(ret, this.decodePixels());
      return ret;
    };

    // scratchCanvas = document.createElement('canvas');

    // scratchCtx = scratchCanvas.getContext('2d');

    makeImage = function(imageData) {
      var img;
      scratchCtx.width = imageData.width;
      scratchCtx.height = imageData.height;
      scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
      scratchCtx.putImageData(imageData, 0, 0);
      img = new Image;
      img.src = scratchCanvas.toDataURL();
      return img;
    };

    PNG.prototype.decodeFrames = function(ctx) {
      var frame, i, imageData, pixels, _i, _len, _ref, _results;
      if (!this.animation) {
        return;
      }
      _ref = this.animation.frames;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        frame = _ref[i];
        imageData = ctx.createImageData(frame.width, frame.height);
        pixels = this.decodePixels(new Uint8Array(frame.data));
        this.copyToImageData(imageData, pixels);
        frame.imageData = imageData;
        _results.push(frame.image = makeImage(imageData));
      }
      return _results;
    };

    PNG.prototype.renderFrame = function(ctx, number) {
      var frame, frames, prev;
      frames = this.animation.frames;
      frame = frames[number];
      prev = frames[number - 1];
      if (number === 0) {
        ctx.clearRect(0, 0, this.width, this.height);
      }
      if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND) {
        ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
      } else if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS) {
        ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
      }
      if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
        ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
      }
      return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
    };

    PNG.prototype.animate = function(ctx) {
      var doFrame, frameNumber, frames, numFrames, numPlays, _ref,
        _this = this;
      frameNumber = 0;
      _ref = this.animation, numFrames = _ref.numFrames, frames = _ref.frames, numPlays = _ref.numPlays;
      return (doFrame = function() {
        var f, frame;
        f = frameNumber++ % numFrames;
        frame = frames[f];
        _this.renderFrame(ctx, f);
        if (numFrames > 1 && frameNumber / numFrames < numPlays) {
          return _this.animation._timeout = setTimeout(doFrame, frame.delay);
        }
      })();
    };

    PNG.prototype.stopAnimation = function() {
      var _ref;
      return clearTimeout((_ref = this.animation) != null ? _ref._timeout : void 0);
    };

    PNG.prototype.render = function(canvas) {
      var ctx, data;
      if (canvas._png) {
        canvas._png.stopAnimation();
      }
      canvas._png = this;
      canvas.width = this.width;
      canvas.height = this.height;
      ctx = canvas.getContext("2d");
      if (this.animation) {
        this.decodeFrames(ctx);
        return this.animate(ctx);
      } else {
        data = ctx.createImageData(this.width, this.height);
        this.copyToImageData(data, this.decodePixels());
        return ctx.putImageData(data, 0, 0);
      }
    };

    return PNG;

  })();

  window.PNG = PNG;

}).call(this);






// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Generate PNG 4 Pebble
////// adapted from https://github.com/wheany/js-png-encoder/blob/master/generatepng.js

var CRC_TABLE = [];
function make_crc_table() {
  CRC_TABLE = [];
  var n, c, k;
  for (n = 0; n < 256; n++) {
    c = n;
    for (k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    CRC_TABLE[n] = c;
  }
}
make_crc_table();


var PEBBLE_PALETTE = [];
function make_pebble_png_palette(make_color_palette) {
  PEBBLE_PALETTE = [];
  if(make_color_palette) {
    for (var i = 0; i < 64; i++) {
      PEBBLE_PALETTE.push(((i >> 4) & 0x3) * 85);
      PEBBLE_PALETTE.push(((i >> 2) & 0x3) * 85);
      PEBBLE_PALETTE.push(((i >> 0) & 0x3) * 85);
    }
  } else {  // else, make Black and White palette
  PEBBLE_PALETTE.push(0);
  PEBBLE_PALETTE.push(0);
  PEBBLE_PALETTE.push(0);

  PEBBLE_PALETTE.push(255);
  PEBBLE_PALETTE.push(255);
  PEBBLE_PALETTE.push(255);
  }
}



function generate_PNG_for_Pebble(image_data) {
  //var width  = image_data.width;
  //var height = image_data.height;
  //var pixels = image_data.data;
  var bytes_per_pixel =  Math.round(image_data.data.length / (image_data.width * image_data.height));  // 3 for rgb, 4 for rgba.  Shouldn't need to round, but just being safe
  
  function crc(buf) {
    var c = 0xffffffff;
    for (var n = 0; n < buf.length; n++)
      c = CRC_TABLE[(c ^ buf[n]) & 0xff] ^ (c >>> 8);
    return c ^ 0xffffffff;
  }

  function dwordBytes(dword) {
    return [(dword & 0xFF000000) >>> 24, (dword & 0x00FF0000) >>> 16, (dword & 0x0000FF00) >>> 8, (dword & 0x000000FF)];
  }

  function createChunk(length, type, data) {
    return dwordBytes(length).concat(type).concat(data).concat(dwordBytes(crc(type.concat(data))));
  }

  function createIHDR(width, height, bitdepth) {
    var IHDRdata = dwordBytes(width);
    IHDRdata = IHDRdata.concat(dwordBytes(height));
    IHDRdata.push(bitdepth);
    IHDRdata.push(3);  // color type: 3=indexed
    IHDRdata.push(0);  // compression method: 0=deflate (only allowed value)
    IHDRdata.push(0);  // filtering: 0=adaptive (only allowed value)
    IHDRdata.push(0);  // interlacing: 0=none
    return createChunk(13, [73, 72, 68, 82], IHDRdata);
  }

  function map_color_to_palette(palette, red, green, blue) {
    var diffR, diffG, diffB, diffDistance, mappedColor;
    var distance = 3 * 0xFF * 0xFF;  // Max distance
    for(var i=0; i<palette.length; i+=3) {
      diffR = ( palette[i  ] - red );
      diffG = ( palette[i+1] - green );
      diffB = ( palette[i+2] - blue );
      diffDistance = diffR*diffR + diffG*diffG + diffB*diffB;
      if( diffDistance < distance ) { 
        distance = diffDistance; 
        mappedColor = i/3; 
      }
    }
    return(mappedColor);
  }

  var y, x, i;
      
  var png_palette = {},
      png_palette_buff = [],
      paletteIndex = 0;
  
  function getColorIndex(red, green, blue) {
    var color = (((red << 8) | green) << 8) | blue;
    if (typeof png_palette[color] == "undefined") {
      var mappedColorId = map_color_to_palette(PEBBLE_PALETTE, red, green, blue);

      red     = PEBBLE_PALETTE[3*mappedColorId + 0];
      green   = PEBBLE_PALETTE[3*mappedColorId + 1];
      blue    = PEBBLE_PALETTE[3*mappedColorId + 2];

      var color_to_pebble = (((red << 8) | green) << 8) | blue;
      if (typeof png_palette[color_to_pebble] == "undefined") {
        png_palette_buff.push(red);
        png_palette_buff.push(green);
        png_palette_buff.push(blue);
        png_palette[color_to_pebble] = paletteIndex++;
      }
      png_palette[color] = png_palette[color_to_pebble];

    }
    return png_palette[color];
  }

  // compute the reduced palette
  for (i = 0; i < image_data.height*image_data.width; i++)
    getColorIndex(image_data.data[bytes_per_pixel * i] & 0xff, image_data.data[bytes_per_pixel * i + 1] & 0xff, image_data.data[bytes_per_pixel * i + 2] & 0xff);

  var unique_colors = png_palette_buff.length / 3;
  var bitdepth;
  
       if(unique_colors > 16) { bitdepth = 8; console.log("bit depth = 8 (" + unique_colors + " / 64 colors)");} 
  else if(unique_colors >  4) { bitdepth = 4; console.log("bit depth = 4 (" + unique_colors + " / 16 colors)");} 
  else if(unique_colors >  2) { bitdepth = 2; console.log("bit depth = 2 (" + unique_colors + " / 4 colors)");} 
  else                        { bitdepth = 1; console.log("bit depth = 1 (" + unique_colors + " / 2 colors)");}

  var scanlinesArray = [];
  
  for (y = 0; y < image_data.height; y++) {
    scanlinesArray.push(0);  // 0 = No Filter
    var bit_offset = 0;
    var curr_byte  = 0;
    for (x = 0; x < image_data.width; x++) {
      bit_offset += bitdepth;
      curr_byte  += getColorIndex(
        image_data.data[bytes_per_pixel * (y * image_data.width + x)] & 0xff,
        image_data.data[bytes_per_pixel * (y * image_data.width + x) + 1] & 0xff,
        image_data.data[bytes_per_pixel * (y * image_data.width + x) + 2] & 0xff
      ) << (8 - bit_offset);
      if(bit_offset == 8) {
        scanlinesArray.push(curr_byte);
        curr_byte   = 0;
        bit_offset  = 0;
      }
    }
    if(bit_offset > 0)
      scanlinesArray.push(curr_byte);
  }

  var compressedArray = new Zlib.Deflate(scanlinesArray).compress();  // jshint ignore:line
  var data = Array.prototype.slice.call(compressedArray);  // Convert TypedArray to standard JS array
  
  var SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
  var IHDR = createIHDR(image_data.width, image_data.height, bitdepth);                // PNG Header
  var PLTE = createChunk(png_palette_buff.length, [80, 76, 84, 69], png_palette_buff); // PNG Palette
  var IDAT = createChunk(compressedArray.length, [73, 68, 65, 84], data);              // PNG Compressed Data
  var IEND = createChunk(0, [73, 69, 78, 68], []);                                     // PNG End
  return SIGNATURE.concat(IHDR, PLTE, IDAT, IEND);   // Return PNG in a byte array
}