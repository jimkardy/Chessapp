(function(){
  'use strict';
  var E=window.ChessEngine,A=window.ChessAI,O=window.GambitOpenings;
  var L=window.Lessons||[], Pz=window.Puzzles||[], Qz=window.Quizzes||[];
  var state=null, pb=null, pzb=null, lb=null;
  var pIndex=0, lIndex=-1, lMove=0, lList=[], qIdx=-1, qQ=0, qScore=0;
  var hist=[], flip=false;
  var prog={less:0,puz:0,quiz:0,xp:0};

  function load(){try{var s=localStorage.getItem('ct');if(s) prog=Object.assign(prog,JSON.parse(s));}catch(e){} upd();}
  function save(){try{localStorage.setItem('ct',JSON.stringify(prog));}catch(e){} upd();}
  function upd(){
    document.getElementById('xp').textContent='XP '+prog.xp;
    var r='Beginner';
    if(prog.xp>=2000) r='Grandmaster';
    else if(prog.xp>=1500) r='Master';
    else if(prog.xp>=1000) r='Advanced';
    else if(prog.xp>=700) r='Strong';
    else if(prog.xp>=400) r='Solid';
    else if(prog.xp>=200) r='Intermediate';
    else if(prog.xp>=80) r='Learner';
    document.getElementById('rank').textContent='Rank: '+r;
    document.getElementById('pLess').textContent=prog.less+'/'+L.length;
    document.getElementById('pPuz').textContent=prog.puz;
    document.getElementById('pQuiz').textContent=prog.quiz+'/'+Qz.length;
  }
  function show(id){document.querySelectorAll('.view').forEach(function(v){v.hidden=true;});document.getElementById(id).hidden=false;}

  function initBoards(){
    pb=new BoardUI('playBoard',{interactive:true,onMove:playMove});
    pzb=new BoardUI('puzBoard',{interactive:true,onMove:puzMove});
    lb=new BoardUI('lessonBoard',{interactive:false});
  }

  function startGame(){
    state=E.parseFen(E.START_FEN); hist=[]; flip=false;
    if(pb){pb.flip=false;pb.set(state);} updHist(); updStat();
  }
  function updStat(){
    var st=E.gameStatus(state);
    var el=document.getElementById('status');
    if(st.over) el.textContent='Game over: '+st.reason+' '+st.result;
    else if(st.reason==='check') el.textContent=(state.turn==='w'?'White':'Black')+' in check';
    else el.textContent=(state.turn==='w'?'White':'Black')+' to move';
  }
  function updHist(){
    var h=document.getElementById('hist'); h.innerHTML='';
    for(var i=0;i<hist.length;i+=2){
      var d=document.createElement('div');
      d.textContent=(Math.floor(i/2)+1)+'. '+(hist[i]||'')+' '+(hist[i+1]||'');
      h.appendChild(d);
    }
    h.scrollTop=h.scrollHeight;
  }
  function playMove(mv){
    var ms=E.generateLegalMoves(state);
    var fm=null;
    for(var i=0;i<ms.length;i++){if(ms[i].from===mv.from&&ms[i].to===mv.to){fm=ms[i];break;}}
    if(!fm)return;
    var p=state.board[fm.from];
    if(p&&p.toUpperCase()==='P'){
      var rk=fm.to>>4,c=p===p.toUpperCase()?'w':'b';
      if((c==='w'&&rk===7)||(c==='b'&&rk===0)) fm.promo='q';
    }
    E.makeMove(state,fm);
    hist.push(E.moveToSan(E.cloneState(state),fm));
    if(pb) pb.set(state); updHist(); updStat();
    var st=E.gameStatus(state);
    if(st.over){setTimeout(function(){alert('Game over');},50);return;}
    if(state.turn==='b'){
      document.getElementById('status').textContent='Thinking...';
      setTimeout(function(){
        var lvl=parseInt(document.getElementById('level').value,10);
        var res=A.chooseMove(state,lvl);
        if(res.move){
          E.makeMove(state,res.move);
          hist.push(E.moveToSan(state,res.move));
          if(pb) pb.set(state); updHist(); updStat();
          var s2=E.gameStatus(state);
          if(s2.over) setTimeout(function(){alert('Game over');},50);
        }
      },200);
    }
  }

  function buildLessons(){
    var list=document.getElementById('lessonList'); list.innerHTML='';
    for(var i=0;i<L.length;i++){
      var it=document.createElement('button');
      it.className='item'+(i<prog.less?' done':'');
      it.innerHTML='<span>'+(i+1)+'. '+L[i].title+'</span><span>'+(i<prog.less?'done':'')+'</span>';
      (function(idx){it.onclick=function(){openLesson(idx);};})(i);
      list.appendChild(it);
    }
  }
  function openLesson(i){
    lIndex=i; lMove=0; lList=[];
    var les=L[i];
    document.getElementById('lessonTitle').textContent=(i+1)+'. '+les.title;
    document.getElementById('lessonText').innerHTML=les.content||'';
    var bw=document.getElementById('lessonBoardWrap');
    if(les.board&&E){
      bw.hidden=false;
      var st2=E.parseFen(les.board);
      if(lb){lb.set(st2);}
      document.getElementById('lbInfo').textContent=les.moves&&les.moves[0]?les.moves[0].info||'':'';
    }else{bw.hidden=true;}
    var md=document.getElementById('markDone');
    md.disabled=(i<prog.less);
    md.textContent=(i<prog.less?'Done':'Mark done');
    show('lesson');
  }

  function buildPuz(){
    pIndex=0; loadPuz();
    document.getElementById('pzCount').textContent=prog.puz;
  }
  function loadPuz(){
    var p=Pz[pIndex%Pz.length];
    document.getElementById('pzNum').textContent='Puzzle '+(pIndex+1);
    document.getElementById('pzTheme').textContent=p.theme;
    document.getElementById('pzDesc').textContent=p.description;
    document.getElementById('pzMsg').textContent=''; document.getElementById('pzMsg').className='msg';
    if(E&&pzb){var st=E.parseFen(p.fen); pzb.set(st); document.getElementById('pzTurn').textContent=(st.turn==='w'?'White to move':'Black to move');}
  }
  function puzMove(mv){
    var p=Pz[pIndex%Pz.length];
    if(!E)return;
    var st=E.parseFen(p.fen);
    var ms=E.generateLegalMoves(st); var us=null;
    for(var i=0;i<ms.length;i++){if(ms[i].from===mv.from&&ms[i].to===mv.to){us=E.moveToSan(st,ms[i]);break;}}
    if(us&&p.solution.indexOf(us)>=0){
      document.getElementById('pzMsg').textContent='Correct';
      document.getElementById('pzMsg').className='msg ok';
      prog.puz++; prog.xp+=15; save(); document.getElementById('pzCount').textContent=prog.puz;
    }else{
      document.getElementById('pzMsg').textContent='Try again';
      document.getElementById('pzMsg').className='msg bad';
      loadPuz();
    }
  }

  function buildQuiz(){
    document.getElementById('quizList').hidden=false;
    document.getElementById('quizRun').hidden=true;
    document.getElementById('quizEnd').hidden=true;
    var list=document.getElementById('quizList'); list.innerHTML='';
    for(var i=0;i<Qz.length;i++){
      var it=document.createElement('button');
      it.className='item'+(i<prog.quiz?' done':'');
      it.innerHTML='<span>'+Qz[i].title+'</span><span>'+(Qz[i].questions.length)+' q</span>';
      (function(idx){it.onclick=function(){startQuiz(idx);};})(i);
      list.appendChild(it);
    }
  }
  function startQuiz(i){
    qIdx=i; qQ=0; qScore=0;
    document.getElementById('quizList').hidden=true;
    document.getElementById('quizRun').hidden=false;
    document.getElementById('quizEnd').hidden=true;
    showQ();
  }
  function showQ(){
    var q=Qz[qIdx].questions[qQ];
    document.getElementById('qTitle').textContent=Qz[qIdx].title;
    document.getElementById('qProg').textContent=(qQ+1)+'/'+Qz[qIdx].questions.length;
    document.getElementById('qText').textContent=q.question;
    var o=document.getElementById('qOpts'); o.innerHTML='';
    document.getElementById('qNext').hidden=true;
    for(var i=0;i<q.options.length;i++){
      var b=document.createElement('button');
      b.className='opt'; b.textContent=String.fromCharCode(65+i)+'. '+q.options[i];
      (function(idx,btn){btn.onclick=function(){ans(idx,btn);};})(i,b);
      o.appendChild(b);
    }
  }
  function ans(i,btn){
    var q=Qz[qIdx].questions[qQ];
    var opts=document.querySelectorAll('#qOpts .opt');
    opts.forEach(function(x){x.disabled=true;});
    if(i===q.correct){btn.classList.add('ok'); qScore++;}
    else{btn.classList.add('bad'); opts[q.correct].classList.add('ok');}
    if(qQ<Qz[qIdx].questions.length-1) document.getElementById('qNext').hidden=false;
    else setTimeout(endQuiz,600);
  }
  function endQuiz(){
    document.getElementById('quizRun').hidden=true;
    document.getElementById('quizEnd').hidden=false;
    var total=Qz[qIdx].questions.length;
    document.getElementById('qScore').textContent='Score '+qScore+'/'+total;
    if(qIdx>=prog.quiz){prog.quiz++; prog.xp+=40; save(); buildQuiz();}
  }

  function wire(){
    document.getElementById('goHome').onclick=function(){show('menu');};
    document.getElementById('btnLessons').onclick=function(){buildLessons();show('lessons');};
    document.getElementById('btnPuzzles').onclick=function(){buildPuz();show('puzzles');};
    document.getElementById('btnQuiz').onclick=function(){buildQuiz();show('quiz');};
    document.getElementById('btnPlay').onclick=function(){startGame();show('play');};

    document.querySelectorAll('.back').forEach(function(b){b.onclick=function(){show(b.dataset.back);};});

    document.getElementById('markDone').onclick=function(){
      if(lIndex>=0&&lIndex>=prog.less){prog.less=lIndex+1; prog.xp+=30; save(); buildLessons(); openLesson(lIndex);}
    };

    document.getElementById('pzHint').onclick=function(){var p=Pz[pIndex%Pz.length]; alert('Look for: '+p.theme+'. Try to find '+p.solution[0]);};
    document.getElementById('pzReset').onclick=loadPuz;
    document.getElementById('pzNext').onclick=function(){pIndex++; loadPuz();};

    document.getElementById('qNext').onclick=function(){qQ++; document.getElementById('qNext').hidden=true; showQ();};

    document.getElementById('newg').onclick=startGame;
    document.getElementById('flip').onclick=function(){flip=!flip; if(pb){pb.flip=flip; pb.set(state);}};
    document.getElementById('undo').onclick=function(){
      if(hist.length<2)return;
      hist.pop(); hist.pop();
      state=E.parseFen(E.START_FEN);
      for(var i=0;i<hist.length;i++){
        var ms=E.generateLegalMoves(state);
        for(var j=0;j<ms.length;j++){
          var s2=E.moveToSan(E.cloneState(state),ms[j]);
          if(s2===hist[i]||E.algebraic(ms[j].from)+E.algebraic(ms[j].to)===hist[i]){E.makeMove(state,ms[j]);break;}
        }
      }
      if(pb) pb.set(state); updHist(); updStat();
    };
  }

  function init(){load(); initBoards(); wire(); show('menu');}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
