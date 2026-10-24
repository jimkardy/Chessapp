'use strict';
/* Chess Steps - all screens, progress, tour. */
(function(){
  var E=window.ChessEngine,A=window.ChessAI;
  var L=window.Lessons||[],PZ=window.Puzzles||[],QZ=window.Quizzes||[];
  var KEY='chesssteps_v2';
  var pg={less:0,puz:0,quiz:0,pts:0};
  var li=-1,qi=-1,qq=0,qs=0;
  var level=3,thinking=false;
  var state=null,histSAN=[],histKeys=[],undoStack=[],flip=false;
  var pb=null,pz=null;
  var pzPool=[],pi=0,pzBest=null,pzSt=null,answerShown=false;

  function load(){
    try{
      var s=localStorage.getItem(KEY);
      if(s){var o=JSON.parse(s);if(o&&typeof o==='object')pg={less:o.less|0,puz:o.puz|0,quiz:oquiz(o.quiz),pts:o.pts|0};}
    }catch(e){}
  }
  function oquiz(v){return typeof v==='number'?Math.max(0,v|0):0;}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(pg));}catch(e){}}
  function stats(){
    document.getElementById('xp').textContent='Points '+pg.pts;
    var r='Beginner';
    if(pg.pts>=600)r='Casual';
    if(pg.pts>=1400)r='Improving';
    if(pg.pts>=2400)r='Solid';
    if(pg.pts>=3600)r='Strong';
    if(pg.pts>=5200)r='Advanced';
    if(pg.pts>=7000)r='Expert';
    document.getElementById('rank').textContent='Rank: '+r;
    document.getElementById('learnstat').textContent=pg.less+'/'+L.length;
    document.getElementById('practicestat').textContent=pg.puz+' solved';
    document.getElementById('checkstat').textContent=pg.quiz+'/'+QZ.length;
  }
  function show(id){
    document.querySelectorAll('.screen').forEach(function(s){s.hidden=true;});
    document.getElementById(id).hidden=false;
    window.scrollTo(0,0);
  }
  function q(sel){return document.querySelector(sel);}
  function qa(sel){return Array.prototype.slice.call(document.querySelectorAll(sel));}

  /* ---------- Learn ---------- */
  function learnList(){
    var el=q('#learn-list');el.innerHTML='';
    L.forEach(function(l,i){
      var b=document.createElement('button');
      b.className='list-item'+(i<pg.less?' done':'');
      b.innerHTML='<div><strong>'+(i+1)+'. '+l.title+'</strong><small>'+(i<pg.less?'Completed':'Not read yet')+'</small></div><span class="chev">&#8250;</span>';
      b.onclick=function(){openLesson(i);};
      el.appendChild(b);
    });
    show('screen-learn');
  }
  function openLesson(i){
    li=i;
    q('#lesson-title').textContent=(i+1)+'. '+L[i].title;
    q('#lesson-body').innerHTML=L[i].body||'';
    var d=q('#lesson-done');
    d.disabled=(i<pg.less);
    d.textContent=(i<pg.less?'Completed':'Mark done');
    show('screen-lesson');
  }
  function lessonDone(){
    if(li<0||li<pg.less)return;
    pg.less=li+1;
    pg.pts+=20;
    if(pg.less%4===0)pg.pts+=10;
    save();stats();
    q('#lesson-done').disabled=true;
    q('#lesson-done').textContent='Completed';
  }

  /* ---------- Practice ---------- */
  function validFen(fen,need){
    try{
      var st=E.parseFen(fen);
      if(E.legalMoves(st).length<(need||4))return false;
      return true;
    }catch(e){return false;}
  }
  function buildPzPool(){
    pzPool=[];
    PZ.forEach(function(p,i){
      if(validFen(p.fen,4))pzPool.push({idx:i,fen:p.fen});
    });
    if(!pzPool.length)pzPool=[{idx:0,fen:PZ[0].fen}];
  }
  function pzFill(){
    /* fills #pz with data for random pool entry + options; used by go/practice */
    pi=Math.floor(Math.random()*pzPool.length);
    pzLoad();
  }
  function pzLoad(){
    var rec=pzPool[pi%pzPool.length];
    var p=PZ[rec.idx];
    pzSt=E.parseFen(rec.fen);
    pz.set(pzSt);
    var mv=A.ch(pzSt,Math.min(6,Math.max(2,3+Math.floor(pg.puz/10))),{book:false,tc:700});
    pzBest=E.moveSan(pzSt,mv.move);
    answerShown=false;
    q('#pz-num').textContent='Puzzle '+(pg.puz+1)+' \u00b7 '+(pi+1)+' of '+pzPool.length;
    q('#pz-theme').textContent=p.theme;
    q('#pz-desc').textContent=p.desc;
    q('#pz-side').textContent=pzSt.turn==='w'?'White':'Black';
    q('#pz-msg').textContent='';
    q('#pz-msg').className='msg';
    var optBox=q('#pz-opts');optBox.innerHTML='';
    var all=E.legalMoves(pzSt).map(function(m){return E.moveSan(pzSt,m);});
    var others=[];
    var tries=0;
    while(others.length<3&&tries<80){
      var x=all[Math.floor(Math.random()*all.length)];
      if(x!==pzBest&&others.indexOf(x)<0)others.push(x);
      tries++;
    }
    var opts=[pzBest].concat(others);
    opts.sort(function(){return Math.random()-0.5;});
    opts.forEach(function(o){
      var b=document.createElement('button');
      b.className='opt';
      b.textContent=o;
      b.onclick=function(){pzAns(b,o);};
      optBox.appendChild(b);
    });
  }
  function pzAns(btn,pick){
    if(answerShown)return;
    var box=q('#pz-msg');
    if(pick===pzBest){
      answerShown=true;
      box.textContent='Correct! '+pick;
      box.className='msg ok';
      btn.classList.add('ok');
      qa('#pz-opts .opt').forEach(function(b){b.disabled=true;});
      pg.puz++;pg.pts+=10;
      if(pg.puz%5===0)pg.pts+=15;
      save();stats();
      q('#pz-solved').textContent=pg.puz;
    }else{
      box.textContent='Not that one. Try again.';
      box.className='msg bad';
      btn.disabled=true;
    }
  }

  /* ---------- Coach / quizzes ---------- */
  function qList(){
    q('#quiz-list').hidden=false;
    q('#quiz-run').hidden=true;
    q('#quiz-done').hidden=true;
    var el=q('#quiz-list');el.innerHTML='';
    QZ.forEach(function(qz,i){
      var b=document.createElement('button');
      b.className='list-item'+(i<pg.quiz?' done':'');
      b.innerHTML='<div><strong>'+(i+1)+'. '+qz.title+'</strong><small>'+qz.questions.length+' questions'+(i<pg.quiz?' \u00b7 Completed':'')+'</small></div><span class="chev">&#8250;</span>';
      b.onclick=function(){qStart(i);};
      el.appendChild(b);
    });
    show('screen-check');
  }
  function qStart(i){
    qi=i;qq=0;qs=0;
    q('#quiz-list').hidden=true;
    q('#quiz-run').hidden=false;
    q('#quiz-done').hidden=true;
    qShow();
  }
  function qShow(){
    var item=QZ[qi],qn=item.questions[qq];
    q('#q-title').textContent=item.title;
    q('#q-prog').textContent=(qq+1)+' of '+item.questions.length;
    q('#q-text').textContent=qn.q;
    q('#q-next').hidden=true;
    var box=q('#q-opts');box.innerHTML='';
    qn.a.forEach(function(txt,i){
      var b=document.createElement('button');
      b.className='opt';
      b.textContent=String.fromCharCode(65+i)+'. '+txt;
      b.onclick=function(){qAns(b,i);};
      box.appendChild(b);
    });
  }
  function qAns(btn,i){
    var qn=QZ[qi].questions[qq];
    qa('#q-opts .opt').forEach(function(b){b.disabled=true;});
    if(i===qn.c){
      btn.classList.add('ok');
      qs++;pg.pts+=5;
    }else{
      btn.classList.add('bad');
      qa('#q-opts .opt')[qn.c].classList.add('ok');
    }
    if(qq<QZ[qi].questions.length-1){q('#q-next').hidden=false;}
    else{setTimeout(qEnd,350);}
  }
  function qEnd(){
    q('#quiz-run').hidden=true;
    q('#quiz-done').hidden=false;
    q('#q-score').textContent='Score: '+qs+' / '+QZ[qi].questions.length;
    if(qi>=pg.quiz){pg.quiz++;pg.pts+=25;save();stats();}
  }

  /* ---------- Play ---------- */
  function newGame(){
    state=E.parseFen(E.START_FEN);
    histSAN=[];histKeys=[E.positionKey(state)];undoStack=[];
    thinking=false;
    if(pb){pb.set(state);}
    hist();
    status();
  }
  function status(msg){
    var el=q('#play-status');
    if(msg){el.textContent=msg;return;}
    if(!state)return;
    var gs=E.gameStatus(state,histKeys);
    if(gs.over){el.textContent='Game over: '+(gs.reason||'')+' ('+gs.result+')';return;}
    var safe=E.inCheck(state,state.turn)?' \u00b7 in check':'';
    el.textContent=(state.turn==='w'?'White':'Black')+' to move'+safe;
  }
  function hist(){
    var el=q('#play-hist');el.innerHTML='';
    for(var i=0;i<histSAN.length;i+=2){
      var d=document.createElement('div');
      d.textContent=(i/2+1)+'. '+(histSAN[i]||'')+(histSAN[i+1]?' '+histSAN[i+1]:'');
      el.appendChild(d);
    }
    el.scrollTop=el.scrollHeight;
  }
  function playMove(m){
    if(!state)return;
    if(state.turn!=='w'){
      status('Wait - it is the computer\'s move.');
      return;
    }
    var gs=E.gameStatus(state,histKeys);
    if(gs.over){status();return;}
    undoStack.push({fen:E.toFen(state),san:E.moveSan(state,m),key:E.positionKey(state)});
    E.makeMove(state,m);
    histSAN.push(undoStack[undoStack.length-1].san);
    histKeys.push(E.positionKey(state));
    pb.set(state);
    hist();status();
    afterMove();
  }
  function afterMove(){
    var gs=E.gameStatus(state,histKeys);
    if(gs.over){
      finish(gs);
      return;
    }
    if(state.turn==='b'&&!thinking){
      thinking=true;
      status('Computer is thinking\u2026');
      setTimeout(function(){
        var res=A.ch(state,level,{book:true,tc:800});
        thinking=false;
        if(!res.move){status();return;}
        undoStack.push({fen:E.toFen(state),san:E.moveSan(state,res.move),key:E.positionKey(state)});
        E.makeMove(state,res.move);
        histSAN.push(undoStack[undoStack.length-1].san);
        histKeys.push(E.positionKey(state));
        pb.set(state);
        hist();status();
        var gs2=E.gameStatus(state,histKeys);
        if(gs2.over)finish(gs2);
      },120);
    }
  }
  function finish(gs){
    var pt=gs.result==='1-0'?40:gs.result==='0-1'?10:20;
    pg.pts+=pt;save();stats();
    status('Game over: '+gs.reason+' ('+gs.result+')');
  }
  function undo(){
    if(thinking||!undoStack.length)return;
    var p;
    if(state.turn==='w'&&undoStack.length>=2){
      undoStack.pop(); /* bot's move */
      p=undoStack.pop();
      state=E.parseFen(p.fen);
      histSAN.pop();histSAN.pop();
      histKeys.pop();histKeys.pop();
    }else{
      p=undoStack.pop();
      state=E.parseFen(p.fen);
      histSAN.pop();histKeys.pop();
    }
    thinking=false;
    pb.set(state);hist();status();
  }
  function flipBoard(){
    flip=!flip;
    if(pb){pb.flip=flip;pb.draw();}
  }

  /* ---------- Tour ---------- */
  var TOUR=[
    {t:'Welcome',b:'Chess Steps takes you from zero to strong club player. Four areas: Learn, Practice, Coach, and Play. This tour takes about a minute.'},
    {t:'Learn',b:'Short lessons. Read one, press "Mark done". Finished lessons turn grey and set you up for the next one.'},
    {t:'Practice',b:'A position appears and you pick the best move from four options. The best move is worked out live by the chess engine, so answers are always fair. Wrong picks help you learn: they show which moves are not best.'},
    {t:'Coach',b:'Quizzes that seal in what you learned. There are no penalties, wrong answers show the right one.'},
    {t:'Play',b:'Play the included chess engine - you play white. Level 1 is easy; level 8 is genuinely strong. Use New game, Flip, and Undo any time.'},
    {t:'Points',b:'Every lesson, puzzle, quiz, and game earns points, and points raise your rank at the top. Start with Learn, then Practice. Have fun!'}
  ];
  var ti=0;
  function tourOpen(){ti=0;tourDraw();q('#tour').hidden=false;}
  function tourDraw(){
    q('#tour-body').innerHTML='<strong>'+TOUR[ti].t+'</strong><div>'+TOUR[ti].b+'</div>';
    q('#tour-step').textContent=(ti+1)+'/'+TOUR.length;
    q('#tour-prev').disabled=(ti===0);
    q('#tour-next').textContent=(ti===TOUR.length-1?'Start':'Next');
  }
  function tourNext(){
    if(ti<TOUR.length-1){ti++;tourDraw();}
    else{q('#tour').hidden=true;}
  }

  /* ---------- wiring ---------- */
  function goHome(){show('screen-home');}
  function wire(){
    q('#home').onclick=goHome;
    q('#go-learn').onclick=learnList;
    q('#go-do').onclick=function(){pq();};
    q('#go-check').onclick=qList;
    q('#go-play').onclick=function(){newGame();show('screen-play');};
    q('#tourBtn').onclick=tourOpen;
    qa('.backnav').forEach(function(b){
      b.onclick=function(){
        var t=b.getAttribute('data-back');
        if(t==='screen-learn'){learnList();}
        else if(t==='screen-check'){qList();}
        else{show(t);}
      };
    });
    q('#lesson-done').onclick=lessonDone;
    q('#pz-skip').onclick=pzLoad;
    q('#pz-next').onclick=pzFill;
    q('#q-next').onclick=function(){qq++;qShow();};
    q('#play-new').onclick=newGame;
    q('#play-flip').onclick=flipBoard;
    q('#play-undo').onclick=undo;
    q('#play-level').value='3';
    q('#play-level').onchange=function(){level=parseInt(this.value,10);};
    q('#tour-close').onclick=function(){q('#tour').hidden=true;};
    q('#tour-prev').onclick=function(){if(ti>0){ti--;tourDraw();}};
    q('#tour-next').onclick=tourNext;
    document.addEventListener('keydown',function(ev){
      if(ev.key==='Escape')q('#tour').hidden=true;
    });
  }
  function pq(){
    if(!pzPool.length)buildPzPool();
    pzFill();
    show('screen-practice');
  }
  function init(){
    load();
    buildPzPool();
    pb=new BoardUI('play-board',{interactive:true,onMove:playMove});
    pz=new BoardUI('pz-board',{interactive:false});
    wire();
    stats();
    show('screen-home');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
