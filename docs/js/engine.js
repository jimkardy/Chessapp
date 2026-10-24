'use strict';
/* Static chess training app. No builds, no installs, no server.
   Pieces: 0x88 board. Index r*16+f. r and f are 0-based. */
var START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
function sqIdx(f,r){return r*16+f;}
function fileOf(s){return s & 15;}
function rankOf(s){return s >> 4;}
function onBoard(s){return (s & 0x88)===0;}
function alg(s){return 'abcdefgh'[fileOf(s)]+(rankOf(s)+1);}
function fromAlg(x){
  if(typeof x!=='string'||x.length<2)return -1;
  var f='abcdefgh'.indexOf(x[0].toLowerCase());
  var r=parseInt(x[1],10)-1;
  if(f<0||r<0||r>7)return -1;
  return sqIdx(f,r);
}
function isWhite(p){return !!p && p===p.toUpperCase();}
function pieceColor(p){return !p?null:(p===p.toUpperCase()?'w':'b');}
function opp(c){return c==='w'?'b':'w';}
function emptyBoard(){var b=new Array(128);for(var i=0;i<128;i++)b[i]=null;return b;}
function cloneState(s){
  return {board:s.board.slice(),turn:s.turn,castling:{
    K:s.castling.K,Q:s.castling.Q,k:s.castling.k,q:s.castling.q
  },ep:s.ep,half:s.half,full:s.full};
}
/* Move: {from,to,piece,captured,promo,ep,castle,double} */
function Move(from,to,piece,captured,promo,flags){
  this.from=from;this.to=to;this.piece=piece;
  this.captured=captured||null;this.promo=promo||null;
  flags=flags||{};this.ep=!!flags.ep;this.castle=flags.castle||null;this.double=!!flags.double;
}

function parseFen(fen){
  fen=(fen||START_FEN).trim();
  var p=fen.split(/\s+/);
  var b=emptyBoard();
  var rows=p[0].split('/');
  if(rows.length!==8)throw new Error('bad fen rows');
  for(var r=0;r<8;r++){
    var rank=7-r,file=0;
    for(var i=0;i<rows[r].length;i++){
      var c=rows[r][i];
      if(/[1-8]/.test(c))file+=parseInt(c,10);
      else if(/[prnbqkPRNBQK]/.test(c)){b[sqIdx(file,rank)]=c;file++;}
    }
    if(file!==8)throw new Error('bad fen width');
  }
  var cs=p[2]||'-';
  var ep=p[3]&&p[3]!=='-'?fromAlg(p[3]):-1;
  return {
    board:b,turn:p[1]==='b'?'b':'w',
    castling:{K:cs.indexOf('K')>=0,Q:cs.indexOf('Q')>=0,k:cs.indexOf('k')>=0,q:cs.indexOf('q')>=0},
    ep:(ep>=0&&onBoard(ep))?ep:-1,
    half:+p[4]||0,full:+p[5]||1
  };
}
function castlingStr(s){
  var c=s.castling,x='';
  if(c.K)x+='K';if(c.Q)x+='Q';if(c.k)x+='k';if(c.q)x+='q';
  return x||'-';
}
function toFen(s){
  var out='';
  for(var r=7;r>=0;r--){
    var e=0;
    for(var f=0;f<8;f++){
      var p=s.board[sqIdx(f,r)];
      if(!p)e++;
      else{if(e){out+=e;e=0;}out+=p;}
    }
    if(e)out+=e;
    if(r>0)out+='/';
  }
  var ep=s.ep>=0?alg(s.ep):'-';
  return out+' '+s.turn+' '+castlingStr(s)+' '+ep+' '+s.half+' '+s.full;
}
/* Position key: for 3-fold detection. Ignores clocks. */
function positionKey(s){
  var out='';
  for(var r=7;r>=0;r--){
    var e=0;
    for(var f=0;f<8;f++){
      var p=s.board[sqIdx(f,r)];
      if(!p)e++;
      else{if(e){out+=e;e=0;}out+=p;}
    }
    if(e)out+=e;
    if(r>0)out+='/';
  }
  return out+' '+s.turn+' '+castlingStr(s)+' '+(s.ep>=0?alg(s.ep):'-');
}
var KN=[33,31,18,14,-14,-18,-31,-33];
var BI=[17,15,-15,-17];
var RO=[16,-16,1,-1];
var KI=[17,16,15,1,-1,-15,-16,-17];

function addPawn(m,u,t,p,c,fl){
  var pr=pieceColor(p)==='w'?7:0;
  if(rankOf(t)===pr){'qrbn'.split('').forEach(function(x){m.push(new Move(u,t,p,c,x,fl));});}
  else m.push(new Move(u,t,p,c,null,fl));
}
function genPseudo(st,capOnly){
  var m=[],us=st.turn,them=opp(us),b=st.board,i,to,tg,d,off,s,p,tp,directions,start,dir,sr,t2,cs2,csq,rookSq,rook,f1,g1,d1,c1,b1,rook2,rsq2;
  for(s=0;s<128;s++){
    if(!onBoard(s))continue;
    p=b[s];if(!p||pieceColor(p)!==us)continue;
    tp=p.toUpperCase();
    if(tp==='P'){
      dir=us==='w'?16:-16;sr=us==='w'?1:6;
      if(!capOnly){
        to=s+dir;
        if(onBoard(to)&&!b[to]){
          addPawn(m,s,to,p,null,null);
          if(rankOf(s)===sr){t2=s+dir*2;if(!b[t2])m.push(new Move(s,t2,p,null,null,{double:true}));}
        }
      }
      cs2=[s+dir-1,s+dir+1];
      for(i=0;i<2;i++){
        to=cs2[i];if(!onBoard(to))continue;
        tg=b[to];
        if(tg&&pieceColor(tg)===them)addPawn(m,s,to,p,tg,null);
        else if(to===st.ep&&!tg){
          csq=to-dir;
          if(b[csq]&&b[csq].toUpperCase()==='P')m.push(new Move(s,to,p,b[csq],null,{ep:true}));
        }
      }
      continue;
    }
    if(tp==='N'||tp==='K'){
      var ofs=tp==='N'?KN:KI;
      for(i=0;i<8;i++){
        to=s+ofs[i];if(!onBoard(to))continue;
        tg=b[to];
        if(!tg){if(!capOnly)m.push(new Move(s,to,p,null,null,null));}
        else if(pieceColor(tg)===them)m.push(new Move(s,to,p,tg,null,null));
      }
      if(tp==='K'&&!capOnly)tryCastle(st,m,s,p);
      continue;
    }
    directions=tp==='B'?BI:tp==='R'?RO:KI;
    for(i=0;i<directions.length;i++){
      off=directions[i];to=s+off;
      while(onBoard(to)){
        tg=b[to];
        if(!tg){if(!capOnly)m.push(new Move(s,to,p,null,null,null));}
        else{if(pieceColor(tg)===them)m.push(new Move(s,to,p,tg,null,null));break;}
        to+=off;
      }
    }
  }
  return m;
}
function tryCastle(st,m,ksq,kp){
  var us=st.turn,b=st.board,them=opp(us);
  var home=(us==='w')?sqIdx(4,0):sqIdx(4,7);
  if(ksq!==home)return;
  if(isAttacked(st,home,them))return;
  if(st.castling[us==='w'?'K':'k']){
    var f1=(us==='w')?sqIdx(5,0):sqIdx(5,7);
    var g1=(us==='w')?sqIdx(6,0):sqIdx(6,7);
    var rookSq=(us==='w')?sqIdx(7,0):sqIdx(7,7);
    var rook=b[rookSq];
    if(rook&&rook.toUpperCase()==='R'&&pieceColor(rook)===us&&!b[f1]&&!b[g1]&&!isAttacked(st,f1,them)&&!isAttacked(st,g1,them))
      m.push(new Move(ksq,g1,kp,null,null,{castle:'K'}));
  }
  if(st.castling[us==='w'?'Q':'q']){
    var d1=(us==='w')?sqIdx(3,0):sqIdx(3,7);
    var c1=(us==='w')?sqIdx(2,0):sqIdx(2,7);
    var b1=(us==='w')?sqIdx(1,0):sqIdx(1,7);
    var rsq2=(us==='w')?sqIdx(0,0):sqIdx(0,7);
    var rook2=b[rsq2];
    if(rook2&&rook2.toUpperCase()==='R'&&pieceColor(rook2)===us&&!b[d1]&&!b[c1]&&!b[b1]&&!isAttacked(st,d1,them)&&!isAttacked(st,c1,them))
      m.push(new Move(ksq,c1,kp,null,null,{castle:'Q'}));
  }
}
function isAttacked(st,tg,by){
  var b=st.board,i,s,p;
  if(by==='w'){var pw=[tg-15,tg-17];for(i=0;i<2;i++){s=pw[i];if(onBoard(s)&&b[s]==='P')return true;}}
  else{var pb=[tg+15,tg+17];for(i=0;i<2;i++){s=pb[i];if(onBoard(s)&&b[s]==='p')return true;}}
  for(i=0;i<8;i++){s=tg+KN[i];if(onBoard(s)){p=b[s];if((p==='N'||p==='n')&&pieceColor(p)===by)return true;}}
  for(i=0;i<8;i++){s=tg+KI[i];if(onBoard(s)){p=b[s];if((p==='K'||p==='k')&&pieceColor(p)===by)return true;}}
  for(i=0;i<4;i++){s=tg+BI[i];while(onBoard(s)){p=b[s];if(p){if(pieceColor(p)===by&&(p==='B'||p==='b'||p==='Q'||p==='q'))return true;break;}s+=BI[i];}}
  for(i=0;i<4;i++){s=tg+RO[i];while(onBoard(s)){p=b[s];if(p){if(pieceColor(p)===by&&(p==='R'||p==='r'||p==='Q'||p==='q'))return true;break;}s+=RO[i];}}
  return false;
}
function kingSq(st,color){
  var k=color==='w'?'K':'k';
  for(var s=0;s<128;s++){if(onBoard(s)&&st.board[s]===k)return s;}
  return -1;
}
function inCheck(st,c){c=c||st.turn;var k=kingSq(st,c);if(k<0)return false;return isAttacked(st,k,opp(c));}
function makeMove(st,m){
  var b=st.board,us=st.turn;
  var u={m:m,cap:null,capSq:-1,cas:castlingStr(st),ep:st.ep,half:st.half,full:st.full};
  var isPawn=m.piece.toUpperCase()==='P';
  if(m.captured){
    u.capSq=m.ep?(m.to+(us==='w'?-16:16)):m.to;
    u.cap=b[u.capSq];
    b[u.capSq]=null;
  }
  b[m.to]=m.promo?(us==='w'?m.promo.toUpperCase():m.promo):m.piece;
  b[m.from]=null;
  if(m.castle==='K'){
    var rf=(us==='w')?sqIdx(7,0):sqIdx(7,7),rt=(us==='w')?sqIdx(5,0):sqIdx(5,7);
    b[rt]=b[rf];b[rf]=null;
  }else if(m.castle==='Q'){
    var rf2=(us==='w')?sqIdx(0,0):sqIdx(0,7),rt2=(us==='w')?sqIdx(3,0):sqIdx(3,7);
    b[rt2]=b[rf2];b[rf2]=null;
  }
  if(m.piece==='K'){st.castling.K=false;st.castling.Q=false;}
  if(m.piece==='k'){st.castling.k=false;st.castling.q=false;}
  if(m.from===sqIdx(7,0)||m.to===sqIdx(7,0))st.castling.K=false;
  if(m.from===sqIdx(0,0)||m.to===sqIdx(0,0))st.castling.Q=false;
  if(m.from===sqIdx(7,7)||m.to===sqIdx(7,7))st.castling.k=false;
  if(m.from===sqIdx(0,7)||m.to===sqIdx(0,7))st.castling.q=false;
  st.ep=-1;
  if(isPawn&&m.double)st.ep=(m.from+m.to)/2;
  if(isPawn||m.captured)st.half=0;else st.half++;
  if(us==='b')st.full++;
  st.turn=opp(us);
  return u;
}
function unmakeMove(st,u){
  var b=st.board,m=u.m,us=m.piece===m.piece.toUpperCase()?'w':'b';
  b[m.to]=null;
  b[m.from]=m.piece;
  if(u.cap)b[u.capSq]=u.cap;
  if(m.castle==='K'){
    var rf=(us==='w')?sqIdx(7,0):sqIdx(7,7),rt=(us==='w')?sqIdx(5,0):sqIdx(5,7);
    b[rf]=b[rt];b[rt]=null;
  }else if(m.castle==='Q'){
    var rf2=(us==='w')?sqIdx(0,0):sqIdx(0,7),rt2=(us==='w')?sqIdx(3,0):sqIdx(3,7);
    b[rf2]=b[rt2];b[rt2]=null;
  }
  var c=u.cas;
  st.castling.K=c.indexOf('K')>=0;
  st.castling.Q=c.indexOf('Q')>=0;
  st.castling.k=c.indexOf('k')>=0;
  st.castling.q=c.indexOf('q')>=0;
  st.ep=u.ep;st.half=u.half;st.full=u.full;st.turn=us;
}
function legalMoves(st){
  var ps=genPseudo(st,false),ls=[],us=st.turn,i,u;
  for(i=0;i<ps.length;i++){
    u=makeMove(st,ps[i]);
    if(!inCheck(st,us))ls.push(ps[i]);
    unmakeMove(st,u);
  }
  return ls;
}
function anyLegalMove(st){
  var ps=genPseudo(st,false),us=st.turn,i,u,ok;
  for(i=0;i<ps.length;i++){
    u=makeMove(st,ps[i]);
    ok=!inCheck(st,us);
    unmakeMove(st,u);
    if(ok)return true;
  }
  return false;
}
function moveSan(st,m){
  if(m.castle==='K')return 'O-O'+checkMark(st,m);
  if(m.castle==='Q')return 'O-O-O'+checkMark(st,m);
  var p=st.board[m.from]||m.piece,t=p.toUpperCase(),s='';
  if(t==='P'){
    if(m.captured)s+='abcdefgh'[fileOf(m.from)]+'x';
    s+=alg(m.to);
    if(m.promo)s+='='+m.promo.toUpperCase();
  }else{
    s+=t;
    var ls=legalMoves(st),riv=[],i,j,sf=false,srr=false;
    for(i=0;i<ls.length;i++){
      var x=ls[i];
      if(x.from!==m.from&&x.to===m.to&&st.board[x.from]&&st.board[x.from].toUpperCase()===t&&pieceColor(st.board[x.from])===pieceColor(p))riv.push(x);
    }
    if(riv.length){
      for(j=0;j<riv.length;j++){
        if(fileOf(riv[j].from)===fileOf(m.from))sf=true;
        if(rankOf(riv[j].from)===rankOf(m.from))srr=true;
      }
      if(!sf)s+='abcdefgh'[fileOf(m.from)];
      else if(!srr)s+=(rankOf(m.from)+1);
      else s+=alg(m.from);
    }
    if(m.captured)s+='x';
    s+=alg(m.to);
  }
  return s+checkMark(st,m);
}
function checkMark(st,m){
  var u=makeMove(st,m),x='';
  if(inCheck(st,st.turn))x=anyLegalMove(st)?'+':'#';
  unmakeMove(st,u);
  return x;
}
function sanToMove(st,san){
  san=(san||'').trim().replace(/[+#]+$/,'');
  var ls=legalMoves(st),i;
  for(i=0;i<ls.length;i++)if(moveSan(st,ls[i]).replace(/[+#]$/,'')===san)return ls[i];
  if(/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(san)){
    var f=fromAlg(san.slice(0,2)),t=fromAlg(san.slice(2,4)),pr=san[4]||null;
    for(i=0;i<ls.length;i++){
      if(ls[i].from===f&&ls[i].to===t&&(!pr||ls[i].promo===pr))return ls[i];
    }
  }
  return null;
}
function uci(m){return alg(m.from)+alg(m.to)+(m.promo||'');}
function insufficientMaterial(st){
  var pieces=[],b=st.board,s,p;
  for(s=0;s<128;s++){
    if(!onBoard(s))continue;
    p=b[s];
    if(p&&p.toUpperCase()!=='K')pieces.push(p.toUpperCase());
  }
  if(pieces.length===0)return true;
  if(pieces.length===1)return pieces[0]==='B'||pieces[0]==='N';
  if(pieces.length===2&&pieces[0]===pieces[1]&&pieces[0]==='B')return true;
  return false;
}
function gameStatus(st,keys){
  var ls=legalMoves(st);
  if(!ls.length){
    if(inCheck(st,st.turn))return {over:true,result:st.turn==='w'?'0-1':'1-0',reason:'checkmate'};
    return {over:true,result:'1/2-1/2',reason:'stalemate'};
  }
  if(st.half>=100)return {over:true,result:'1/2-1/2',reason:'fifty move'};
  if(insufficientMaterial(st))return {over:true,result:'1/2-1/2',reason:'material'};
  if(keys){
    var k=positionKey(st),c=0,i;
    for(i=0;i<keys.length;i++)if(keys[i]===k)c++;
    if(c>=3)return {over:true,result:'1/2-1/2',reason:'threefold'};
  }
  return {over:false,legal:ls};
}
function perft(st,d){
  if(d===0)return 1;
  var ps=genPseudo(st,false),us=st.turn,n=0,i,u;
  for(i=0;i<ps.length;i++){
    u=makeMove(st,ps[i]);
    if(!inCheck(st,us))n+=perft(st,d-1);
    unmakeMove(st,u);
  }
  return n;
}
var ChessEngine={
  START_FEN:START_FEN,sqIdx:sqIdx,fileOf:fileOf,rankOf:rankOf,onBoard:onBoard,
  alg:alg,fromAlg:fromAlg,opp:opp,pieceColor:pieceColor,isWhite:isWhite,
  parseFen:parseFen,toFen:toFen,positionKey:positionKey,cloneState:cloneState,
  legalMoves:legalMoves,genPseudo:genPseudo,makeMove:makeMove,unmakeMove:unmakeMove,
  inCheck:inCheck,kingSq:kingSq,isAttacked:isAttacked,anyLegalMove:anyLegalMove,
  moveSan:moveSan,sanToMove:sanToMove,uci:uci,gameStatus:gameStatus,
  insufficientMaterial:insufficientMaterial,perft:perft,castlingStr:castlingStr
};
if(typeof module!=='undefined'&&module.exports)module.exports=ChessEngine;
if(typeof window!=='undefined')window.ChessEngine=ChessEngine;
