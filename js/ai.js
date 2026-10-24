(function(){
  'use strict';
  var E=window.ChessEngine;
  var M=100000,INF=1000005;
  var V={P:100,N:320,B:330,R:500,Q:900,K:20000};
  var PST={
    P:[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
    N:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
    B:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
    R:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
    Q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
    K:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20],
    KE:[-50,-40,-30,-20,-20,-30,-40,-50,-30,-20,-10,0,0,-10,-20,-30,-30,-10,20,30,30,20,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,20,30,30,20,-10,-30,-30,-30,0,0,0,0,-30,-30,-50,-30,-30,-30,-30,-30,-30,-50]
  };
  function pi(s,c){var f=s&15,r=s>>4;return c==='w'?(7-r)*8+f:r*8+f;}
  function pcnt(x){var n=0;while(x){x&=x-1;n++;}return n;}
  function eval(st){
    var b=st.board,sc=0,s,p,tp,col,i,pm={w:[0,0,0,0,0,0,0,0],b:[0,0,0,0,0,0,0,0]},bis={w:0,b:0},rks=[],ksq={w:-1,b:-1},npm=0,list=[];
    for(s=0;s<120;s++){if(s&0x88)continue;p=b[s];if(!p)continue;col=p===p.toUpperCase()?'w':'b';tp=p.toUpperCase();sc+=(col==='w'?1:-1)*V[tp];list.push({t:tp,c:col,sq:s});if(tp==='P')pm[col][s&15]|=(1<<(s>>4));else if(tp==='B'){bis[col]++;npm+=V.B;}else if(tp==='R'){rks.push({c:col,f:s&15});npm+=V.R;}else if(tp==='Q'){npm+=V.Q;}else if(tp==='K'){ksq[col]=s;}}
    var end=npm<1500;
    for(i=0;i<list.length;i++){var pc=list[i],tbl=PST[pc.t];if(pc.t==='K'&&end)tbl=PST.KE;sc+=(pc.c==='w'?1:-1)*tbl[pi(pc.sq,pc.c)];}
    if(bis.w>=2)sc+=25;if(bis.b>=2)sc-=25;
    for(var f=0;f<8;f++){['w','b'].forEach(function(c){var msk=pm[c][f];if(!msk)return;var sd=c==='w'?1:-1,cnt=pcnt(msk);if(cnt>1)sc-=sd*12;var adj=(f>0?pm[c][f-1]:0)|(f<7?pm[c][f+1]:0);if(!adj)sc-=sd*14;var em=(f>0?pm[c==='w'?'b':'w'][f-1]:0)|pm[c==='w'?'b':'w'][f]|(f<7?pm[c==='w'?'b':'w'][f+1]:0);for(var r=0;r<8;r++){if(!(msk&(1<<r)))continue;var ah=c==='w'?(em>>(r+1)): (em&((1<<r)-1));if(!ah){var av=c==='w'?r:7-r;if(av>=3)sc+=sd*(av-2)*12;}}});}
    for(i=0;i<rks.length;i++){var rk=rks[i],om=pm[rk.c][rk.f],em2=pm[rk.c==='w'?'b':'w'][rk.f];if(!om&&!em2)sc+=(rk.c==='w'?1:-1)*16;else if(!om)sc+=(rk.c==='w'?1:-1)*8;}
    if(!end){['w','b'].forEach(function(c){var k=ksq[c];if(k<0)return;var kf=k&15,kr=k>>4,dir=c==='w'?1:-1,sh=0;for(var df=-1;df<=1;df++){var ff=kf+df,rr=kr+dir;if(ff<0||ff>7||rr<0||rr>7)continue;if(pm[c][ff]&(1<<rr))sh++;}sc+=(c==='w'?1:-1)*sh*10;});}
    sc+=st.turn==='w'?6:-6;
    return sc;
  }
  function msco(st,m,ply,kill){var s=0;if(m.captured)s+=900+V[m.captured.toUpperCase()]*8-V[m.piece.toUpperCase()];if(m.promo)s+=800+V[m.promo.toUpperCase()];if(kill&&kill[ply]&&kill[ply].from===m.from&&kill[ply].to===m.to)s+=400;if(m.castle)s+=120;return s;}
  function om(st,ms,ply,kill){for(var i=0;i<ms.length;i++)ms[i]._s=msco(st,ms[i],ply,kill);ms.sort(function(a,b){return b._s-a._s;});return ms;}
  function ctx(t){return {n:0,stop:false,dl:Date.now()+t,kill:{}};}
  function ct(c){if(c.stop)return true;if((c.n&1023)===0&&Date.now()>c.dl)c.stop=true;return c.stop;}
  function qst(st,a,b,c,ply,qd){c.n++;if(ct(c))return 0;var sv=eval(st),sd=st.turn==='w'?1:-1,sf=sv*sd;if(sf>=b)return b;if(sf>a)a=sf;if(qd<=0)return a;var ms=E.gpm(st,true);om(st,ms,ply,c.kill);for(var i=0;i<ms.length;i++){var m=ms[i];if(m.captured&&sf+V[m.captured.toUpperCase()]+150<a)continue;var un=E.mm(st,m);if(E.ic(st,E.op(st.turn))){E.um(st,un);continue;}var sc=-qst(st,-b,-a,c,ply+1,qd-1);E.um(st,un);if(c.stop)return 0;if(sc>=b)return b;if(sc>a)a=sc;}return a;}
  function ng(st,dep,a,b,c,ply){c.n++;if(ct(c))return 0;if(dep<=0)return qst(st,a,b,c,ply,3);var ms=E.gl(st);if(ms.length===0){if(E.ic(st,st.turn))return -M+ply;return 0;}if(dep===1&&ms.length===1)dep=2;om(st,ms,ply,c.kill);var best=-INF;for(var i=0;i<ms.length;i++){var m=ms[i];var un=E.mm(st,m);var sc=-ng(st,dep-1,-b,-a,c,ply+1);E.um(st,un);if(c.stop)return 0;if(sc>best)best=sc;if(sc>a)a=sc;if(a>=b){if(!m.captured)c.kill[ply]={from:m.from,to:m.to};break;}}return best;}
  function srch(st,opts){opts=opts||{};var md=Math.max(1,Math.min(8,opts.depth||3)),mt=opts.time||900,cc=ctx(mt),rm=E.gl(st);if(!rm.length)return {move:null};if(rm.length===1)return {move:rm[0]};var ord=rm.slice(),bm=rm[0],bs=0,cd=0,stt=Date.now();for(var d=1;d<=md;d++){var a=-INF,b=INF,lbm=null,lbs=-INF,scd=[];om(st,ord,0,cc.kill);for(var i=0;i<ord.length;i++){var m=ord[i];var un=E.mm(st,m);var sc=-ng(st,d-1,-b,-a,cc,1);E.um(st,un);if(cc.stop)break;scd.push({m:m,s:sc});if(sc>lbs){lbs=sc;lbm=m;}if(sc>a)a=sc;}if(cc.stop)break;if(lbm){var cl=scd.filter(function(x){return x.s>=lbs-6;});var pk=cl[Math.floor(Math.random()*cl.length)]||{m:lbm,s:lbs};bm=pk.m;bs=pk.s;cd=d;ord=[bm].concat(ord.filter(function(x){return x!==bm;}));}if(Date.now()-stt>mt&&d>=2)break;}return {move:bm,score:bs,depth:cd,nodes:cc.n,time:Date.now()-stt};}
  var LV=[{id:1,dep:1,t:60,bl:0.8},{id:2,dep:1,t:100,bl:0.6},{id:3,dep:1,t:160,bl:0.3},{id:4,dep:2,t:260,bl:0.14},{id:5,dep:2,t:380,bl:0.06},{id:6,dep:3,t:520,bl:0},{id:7,dep:4,t:720,bl:0},{id:8,dep:5,t:920,bl:0}];
  function ch(st,lid,opts){var lv=LV[Math.max(0,Math.min(LV.length-1,(lid||1)-1))],lg=E.gl(st);if(!lg.length)return {move:null};var obk=window.GambitOpenings,ok=false;try{if(typeof require!=='undefined'&&!obk)obk=require('./openings');}catch(e){}if(obk&&(!opts||opts.book!==false)&&lv.id>=4&&st.full<=9){var bm2=obk.bookMove(st);if(bm2){ok=true;return {move:bm2,book:true};}}if(lv.bl&&Math.random()<lv.bl)return {move:lg[Math.floor(Math.random()*lg.length)],rand:true};var r=srch(st,{depth:lv.dep,time:lv.t});r.book=ok;return r;}
  var API={eval:eval,srch:srch,ch:ch,LV:LV};
  if(typeof module!=='undefined'&&module.exports)module.exports=API;
  if(typeof window!=='undefined')window.ChessAI=API;
})();
