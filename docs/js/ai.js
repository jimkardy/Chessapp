'use strict';
/* Small alpha-beta search with quiescence + piece-square tables. */
(function(){
  var E=window.ChessEngine;
  var P={p:100,n:320,b:330,r:500,q:900,k:0};
  /* piece-square tables, white view, index = file + rank*8 (rank 0 = white back rank) */
  var PST={};
  PST.p=[0,0,0,0,0,0,0,0,
        50,50,50,50,50,50,50,50,
        10,10,20,30,30,20,10,10,
        5,5,10,25,25,10,5,5,
        0,0,0,20,20,0,0,0,
        5,-5,-10,0,0,-10,-5,5,
        5,10,10,-20,-20,10,10,5,
        0,0,0,0,0,0,0,0];
  PST.n=[-50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,0,0,0,0,-20,-40,
        -30,0,10,15,15,10,0,-30,
        -30,5,15,20,20,15,5,-30,
        -30,0,15,20,20,15,0,-30,
        -30,5,10,15,15,10,5,-30,
        -40,-20,0,5,5,0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50];
  PST.b=[-20,-10,-10,-10,-10,-10,-10,-20,
        -10,0,0,0,0,0,0,-10,
        -10,0,5,10,10,5,0,-10,
        -10,5,5,10,10,5,5,-10,
        -10,0,10,10,10,10,0,-10,
        -10,10,10,10,10,10,10,-10,
        -10,5,0,0,0,0,5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20];
  PST.r=[0,0,0,0,0,0,0,0,
        5,10,10,10,10,10,10,5,
        -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5,
        0,0,0,5,5,0,0,0];
  PST.q=[-20,-10,-10,-5,-5,-10,-10,-20,
        -10,0,0,0,0,0,0,-10,
        -10,0,5,5,5,5,0,-10,
        -5,0,5,5,5,5,0,-5,
        0,0,5,5,5,5,0,-5,
        -10,5,5,5,5,5,0,-10,
        -10,0,5,0,0,0,0,-10,
        -20,-10,-10,-5,-5,-10,-10,-20];
  PST.k=[-30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
        20,20,0,0,0,0,20,20,
        20,30,10,0,0,10,30,20];
  PST.kEnd=[-50,-40,-30,-20,-20,-30,-40,-50,
        -30,-20,-10,0,0,-10,-20,-30,
        -30,-10,20,30,30,20,-10,-30,
        -30,-10,30,40,40,30,-10,-30,
        -30,-10,30,40,40,30,-10,-30,
        -30,-10,20,30,30,20,-10,-30,
        -30,-30,0,0,0,0,-30,-30,
        -50,-30,-30,-30,-30,-30,-30,-50];

  function squareTableIndex(sq,white){
    var f=E.fileOf(sq),r=E.rankOf(sq);
    if(!white)r=7-r;
    return f+r*8;
  }
  function eva(st){
    var b=st.board,score=0,s,p,t,white,pawns=0,pieces=0,wsb=0,bsb=0,wsq=0,scoreW=0,scoreB=0;
    for(s=0;s<128;s++){
      if(!E.onBoard(s))continue;
      p=b[s];if(!p)continue;
      t=p.toLowerCase();white=p===p.toUpperCase();
      if(t==='k'){wsq+=1;scoreW+=white?0:0;continue;}
      var v=P[t]+(PST[t][squareTableIndex(s,white)]);
      if(white)score+=v;else score-=v;
      if(t==='p')pawns++;
      else{pieces++; if(white&&t==='b')wsb=1; if(!white&&t==='b')bsb=1;}
      if(white)scoreW+=P[t];else scoreB+=P[t];
    }
    if(pieces<=6){/* endgame: prefer central king */
      var kw=E.kingSq(st,'w'),kb=E.kingSq(st,'b');
      if(kw>=0)score+=PST.kEnd[squareTableIndex(kw,true)];
      if(kb>=0)score-=PST.kEnd[squareTableIndex(kb,false)];
    }else{
      var kw2=E.kingSq(st,'w'),kb2=E.kingSq(st,'b');
      if(kw2>=0)score+=PST.k[squareTableIndex(kw2,true)];
      if(kb2>=0)score-=PST.k[squareTableIndex(kb2,false)];
    }
    if(wsb&&E.kingSq(st,'w')>=0&&bCount(st,'w')>=2)score+=40;
    if(bsb&&bCount(st,'b')>=2)score-=40;
    /* small tempo */
    if(st.turn==='w')score+=10;else score-=10;
    return score;
  }
  function bCount(st,c){
    var b=st.board,s,n=0;
    for(s=0;s<128;s++){if(E.onBoard(s)&&b[s]&&(b[s]==='B'||b[s]==='b')&&E.pieceColor(b[s])===c)n++;}
    return n;
  }
  var KNOWN={
    p:101,n:321,b:331,r:501,q:901,k:20000
  };
  function scoreMove(m){
    var s=0;
    if(m.promo)s+=900;
    if(m.captured)s+=KNOWN[m.captured.toLowerCase()]*10-KNOWN[m.piece.toLowerCase()];
    if(m.castle)s+=50;
    return s;
  }
  function ct(c){
    if(c.stop)return true;
    c.n++;
    if((c.n&63)===0){
      if(c.n>c.maxN||Date.now()>c.dead)c.stop=true;
    }
    return c.stop;
  }
  function qst(st,a,b,c,qd){
    c.n++;
    if(ct(c))return 0;
    var sv=eva(st),sd=st.turn==='w'?1:-1,stand=sv*sd;
    if(stand>=b)return b;
    if(stand>a)a=stand;
    if(qd<=0)return a;
    var ms=E.genPseudo(st,true),i,u,scores=[];
    for(i=0;i<ms.length;i++)scores[i]=scoreMove(ms[i]);
    var order=ms.map(function(m,i){return i;}).sort(function(x,y){return scores[y]-scores[x];});
    for(i=0;i<order.length;i++){
      var m=ms[order[i]];
      if(!m.captured&&!m.promo)continue;
      if(stand+KNOWN[m.captured?m.captured.toLowerCase():'p']-100<a)continue;
      u=E.makeMove(st,m);
      if(E.inCheck(st,E.pieceColor(m.piece))){E.unmakeMove(st,u);continue;}
      var sc=-qst(st,-b,-a,c,qd-1);
      E.unmakeMove(st,u);
      if(c.stop)return 0;
      if(sc>=b)return b;
      if(sc>a)a=sc;
    }
    return a;
  }
  function neg(st,depth,a,b,c,ply){
    c.n++;
    if(ct(c))return 0;
    if(depth<=0)return qst(st,a,b,c,4);
    var ms=E.genPseudo(st,false),i,u,any=false,scores=[];
    for(i=0;i<ms.length;i++)scores[i]=scoreMove(ms[i])-ply;
    var order=ms.map(function(m,i){return i;}).sort(function(x,y){return scores[y]-scores[x];});
    for(i=0;i<order.length;i++){
      var m=ms[order[i]];
      u=E.makeMove(st,m);
      if(E.inCheck(st,E.pieceColor(m.piece))){
        E.unmakeMove(st,u);continue;
      }
      any=true;
      var sc=-neg(st,depth-1,-b,-a,c,ply+1);
      E.unmakeMove(st,u);
      if(c.stop)return 0;
      if(sc>=b)return b;
      if(sc>a)a=sc;
    }
    if(!any){
      if(E.inCheck(st,st.turn))return -90000+ply;
      return 0-2*ply;
    }
    return a;
  }
  var DEPTHS=[1,2,3,4,5,6,7,7];
  var TCS=[110,150,250,380,550,800,1100,1400];
  var WIDTH=[250,130,70,40,24,12,4,0];
  function ranked(st,level,opts){
    opts=opts||{};
    var tc=opts.tc||TCS[level-1];
    var depth=opts.depth||DEPTHS[level-1];
    var c={n:0,stop:false,maxN:400000,dead:Date.now()+tc};
    var ms=E.legalMoves(st),i,u;
    var scores0=ms.map(function(m){return scoreMove(m);});
    var order=ms.map(function(m,i){return i;}).sort(function(x,y){return scores0[y]-scores0[x];});
    var out=[],t0=Date.now();
    var alpha=-100000;
    for(var oi=0;oi<order.length;oi++){
      var m=ms[order[oi]];
      u=E.makeMove(st,m);
      var sc=-neg(st,depth-1,-100000,-alpha,c,1);
      E.unmakeMove(st,u);
      if(c.stop){
        if(sc>alpha){out.push({m:m,san:E.moveSan(st,m),score:sc});alpha=sc;}
        break;
      }
      out.push({m:m,san:E.moveSan(st,m),score:sc});
      if(sc>alpha)alpha=sc;
    }
    out.sort(function(x,y){return y.score-x.score;});
    return {moves:out,time:Date.now()-t0,stop:c.stop};
  }
  function pick(st,level,opts){
    opts=opts||{};
    var bookOn=opts.book!==false;
    if(bookOn&&window.ChessBook){
      var bm=window.ChessBook.next(st);
      if(bm)return {move:bm,book:true};
    }
    /* instant mate scan: a move that ends the game right now always wins */
    var ms=E.legalMoves(st),i,u,gs;
    for(i=0;i<ms.length;i++){
      u=E.makeMove(st,ms[i]);
      gs=E.gameStatus(st);
      E.unmakeMove(st,u);
      if(gs.over&&gs.reason==='checkmate'){return {move:ms[i],score:99000};}
    }
    var r=ranked(st,level,opts);
    if(!r.moves.length)return {move:null,score:0};
    var best=r.moves[0].score;
    var w=WIDTH[level-1];
    var pool=r.moves.filter(function(x){return x.score>=best-w;});
    if(!pool.length)pool=[r.moves[0]];
    var pick_=pool[Math.floor(Math.random()*pool.length)];
    return {move:pick_.m,score:pick_.score,pool:pool.length,book:false};
  }
  window.ChessAI={
    ch:pick,
    srch:function(st,opts){
      opts=opts||{};
      opts.depth=opts.depth||6;
      opts.tc=opts.tc||600;
      opts.book=false;
      var r=ranked(st,9,opts);
      return {move:r.moves.length?r.moves[0].m:null,san:r.moves.length?r.moves[0].san:null,list:r.moves};
    },
    ranked:ranked,
    eva:eva
  };
})();
