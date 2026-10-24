(function(){
  'use strict';
  var E=window.ChessEngine,A=window.ChessAI;
  var L=window.Lessons||[],Pz=window.Puzzles||[],Qz=window.Quizzes||[];
  var st=null,pb=null,pzb=null,lb=null;
  var pi=0,li=-1,lm=0,lstep=0;
  var qi=-1,qq=0,qs=0;
  var hist=[],flip=false,prog={puz:0,less:0,quiz:0,pts:0,str:0};

  function load(){try{var s=localStorage.getItem('cs');if(s)prog=Object.assign(prog,JSON.parse(s));}catch(e){}upd();}
  function save(){try{localStorage.setItem('cs',JSON.stringify(prog));}catch(e){}upd();}
  function upd(){
    document.getElementById('streak').textContent='Streak '+prog.str;
    document.getElementById('points').textContent='Points '+prog.pts;
    document.getElementById('pz-count').textContent=prog.puz;
  }
  function show(id){document.querySelectorAll('.screen').forEach(function(v){v.hidden=true;});document.getElementById(id).hidden=false;}

  function binit(){
    pb=new BoardUI('play-board',{interactive:true,onMove:pmove});
    pzb=new BoardUI('pz-board',{interactive:true,onMove:pzm});
    lb=new BoardUI('lesson-board',{interactive:false});
  }

  function llist(){
    var el=document.getElementById('learn-list');el.innerHTML='';
    for(var i=0;i<L.length;i++){
      var b=document.createElement('button');
      b.className='list-item'+(i<prog.less?' done':'');
      b.innerHTML='<div><strong>'+(i+1)+'. '+L[i].title+'</strong></div><small>'+(i<prog.less?'Done':'Open')+'</small>';
      (function(idx){b.onclick=function(){openL(idx);};})(i);
      el.appendChild(b);
    }
  }
  function openL(i){
    li=i;lm=0;
    document.getElementById('lesson-title').textContent=(i+1)+'. '+L[i].title;
    document.getElementById('lesson-body').innerHTML=L[i].body||'';
    var w=document.getElementById('lesson-board-wrap');
    w.hidden=true;
    var d=document.getElementById('lesson-done');
    d.disabled=(i<prog.less); d.textContent=(i<prog.less?'Done':'Mark done');
    show('screen-lesson');
  }

  function pstart(){pi=0;pload();show('screen-practice');}
  function pload(){
    var p=Pz[pi%Pz.length];
    document.getElementById('pz-num').textContent='Puzzle '+(pi+1);
    document.getElementById('pz-theme').textContent=p.theme;
    document.getElementById('pz-desc').textContent=p.desc;
    document.getElementById('pz-msg').textContent='';document.getElementById('pz-msg').className='msg';
    if(E&&pzb){var s=E.pf(p.fen);pzb.set(s);document.getElementById('pz-side').textContent=(s.turn==='w'?'White':'Black');}
  }
  function pzm(mv){
    var p=Pz[pi%Pz.length];
    if(!E)return;
    var s=E.pf(p.fen);
    var ms=E.gl(s);var us=null;
    for(var i=0;i<ms.length;i++){if(ms[i].from===mv.from&&ms[i].to===mv.to){us=E.m2s(s,ms[i]);break;}}
    if(us&&p.sol.indexOf(us)>=0){
      document.getElementById('pz-msg').textContent='Correct';
      document.getElementById('pz-msg').className='msg ok';
      prog.puz++;prog.pts+=10; if(prog.puz%5===0)prog.str++; save(); upd();
    }else{
      document.getElementById('pz-msg').textContent='Not quite';
      document.getElementById('pz-msg').className='msg bad';
      pload();
    }
  }

  function qlist(){
    document.getElementById('quiz-list').hidden=false;document.getElementById('quiz-run').hidden=true;document.getElementById('quiz-done').hidden=true;
    var el=document.getElementById('quiz-list');el.innerHTML='';
    for(var i=0;i<Qz.length;i++){
      var b=document.createElement('button');
      b.className='list-item'+(i<prog.quiz?' done':'');
      b.innerHTML='<div><strong>'+Qz[i].title+'</strong></div><small>'+(Qz[i].questions.length)+' questions</small>';
      (function(idx){b.onclick=function(){qstart(idx);};})(i);
      el.appendChild(b);
    }
  }
  function qstart(i){qi=i;qq=0;qs=0;document.getElementById('quiz-list').hidden=true;document.getElementById('quiz-run').hidden=false;document.getElementById('quiz-done').hidden=true;qshow();}
  function qshow(){
    var q=Qz[qi].questions[qq];
    document.getElementById('q-title').textContent=Qz[qi].title;
    document.getElementById('q-prog').textContent=(qq+1)+'/'+Qz[qi].questions.length;
    document.getElementById('q-text').textContent=q.q;
    var o=document.getElementById('q-opts');o.innerHTML='';
    document.getElementById('q-next').hidden=true;
    for(var i=0;i<q.a.length;i++){
      var b=document.createElement('button');
      b.className='opt';b.textContent=String.fromCharCode(65+i)+'. '+q.a[i];
      (function(idx,btn){btn.onclick=function(){qans(idx,btn);};})(i,b);
      o.appendChild(b);
    }
  }
  function qans(i,btn){
    var q=Qz[qi].questions[qq];
    var os=document.querySelectorAll('#q-opts .opt');
    os.forEach(function(x){x.disabled=true;});
    if(i===q.c){btn.classList.add('ok');qs++;}
    else{btn.classList.add('bad');os[q.c].classList.add('ok');}
    if(qq<Qz[qi].questions.length-1)document.getElementById('q-next').hidden=false;
    else setTimeout(qend,500);
  }
  function qend(){
    document.getElementById('quiz-run').hidden=true;document.getElementById('quiz-done').hidden=false;
    document.getElementById('q-score').textContent='Score '+qs+'/'+Qz[qi].questions.length;
    if(qi>=prog.quiz){prog.quiz++;prog.pts+=25;save();qlist();}
  }

  function gnew(){
    st=E.pf(E.START_FEN); hist=[]; flip=false;
    if(pb){pb.flip=false;pb.set(st);} ghist(); gstat();
  }
  function gstat(){
    var gs=E.gst(st,hist);
    var el=document.getElementById('play-status');
    if(gs.over) el.textContent='Game over';
    else if(gs.reason==='check') el.textContent=(st.turn==='w'?'White':'Black')+' in check';
    else el.textContent=(st.turn==='w'?'White':'Black')+' to move';
  }
  function ghist(){
    var h=document.getElementById('play-hist');h.innerHTML='';
    for(var i=0;i<hist.length;i+=2){
      var d=document.createElement('div');d.textContent=(Math.floor(i/2)+1)+'. '+(hist[i]||'')+' '+(hist[i+1]||'');h.appendChild(d);
    }
    h.scrollTop=h.scrollHeight;
  }
  function pmove(mv){
    var ms=E.gl(st);var fm=null;
    for(var i=0;i<ms.length;i++){if(ms[i].from===mv.from&&ms[i].to===mv.to){fm=ms[i];break;}}
    if(!fm)return;
    var p=st.board[fm.from];
    if(p&&p.toUpperCase()==='P'){var rk=fm.to>>4,c=p===p.toUpperCase()?'w':'b';if((c==='w'&&rk===7)||(c==='b'&&rk===0))fm.promo='q';}
    E.mm(st,fm); hist.push(E.m2s(st,fm));
    if(pb)pb.set(st); ghist(); gstat();
    var gs=E.gst(st,hist);
    if(gs.over){setTimeout(function(){alert('Game over');},40);return;}
    if(st.turn==='b'){
      document.getElementById('play-status').textContent='Thinking...';
      setTimeout(function(){
        var lv=parseInt(document.getElementById('play-level').value,10);
        var res=A.ch(st,lv);
        if(res.move){
          E.mm(st,res.move); hist.push(E.m2s(st,res.move));
          if(pb)pb.set(st); ghist(); gstat();
          var gs2=E.gst(st,hist);
          if(gs2.over)setTimeout(function(){alert('Game over');},40);
        }
      },160);
    }
  }

  var steps=[
    {t:"Home",b:"Pick Learn, Practice, Check, or Play. Go at your pace."},
    {t:"Learn",b:"Read short lessons. Do them in order."},
    {t:"Practice",b:"Find the best move for the side to move."},
    {t:"Check",b:"Short quizzes to lock in basics."},
    {t:"Play",b:"Start low level. Move up only when games feel easy."}
  ];
  var tstep=0;
  function tour(){
    document.getElementById('tour').hidden=false;
    tstep=0; trender();
  }
  function trender(){
    document.getElementById('tour-body').innerHTML='<strong>'+steps[tstep].t+'</strong><div>'+steps[tstep].b+'</div>';
    document.getElementById('tour-step').textContent=(tstep+1)+'/'+steps.length;
    document.getElementById('tour-prev').disabled=tstep===0;
    document.getElementById('tour-next').textContent=tstep===steps.length-1?'Done':'Next';
  }

  function wire(){
    document.getElementById('home').onclick=function(){show('screen-home');};
    document.getElementById('startTour').onclick=tour;
    document.getElementById('tour-close').onclick=function(){document.getElementById('tour').hidden=true;};
    document.getElementById('tour-prev').onclick=function(){if(tstep>0){tstep--;trender();}};
    document.getElementById('tour-next').onclick=function(){if(tstep<steps.length-1){tstep++;trender();}else document.getElementById('tour').hidden=true;};

    document.getElementById('go-learn').onclick=function(){llist();show('screen-learn');};
    document.getElementById('go-do').onclick=function(){pstart();};
    document.getElementById('go-check').onclick=function(){qlist();show('screen-check');};
    document.getElementById('go-play').onclick=function(){gnew();show('screen-play');};

    document.querySelectorAll('.link').forEach(function(b){b.onclick=function(){show(b.dataset.back==='home'?'screen-home':b.dataset.back==='learn'?'screen-learn':b.dataset.back==='menu'?'screen-home':'screen-home');};});
    document.querySelectorAll('.back').forEach(function(b){b.onclick=function(){show('screen-home');};});

    document.getElementById('lesson-done').onclick=function(){
      if(li>=0&&li>=prog.less){prog.less=li+1;prog.pts+=20;if(prog.less%4===0)prog.str++;save();llist();openL(li);}
    };

    document.getElementById('pz-hint').onclick=function(){var p=Pz[pi%Pz.length];alert('Look for: '+p.theme+'. Try '+p.sol[0]);};
    document.getElementById('pz-reset').onclick=pload;
    document.getElementById('pz-next').onclick=function(){pi++;pload();};

    document.getElementById('q-next').onclick=function(){qq++;document.getElementById('q-next').hidden=true;qshow();};

    document.getElementById('play-new').onclick=gnew;
    document.getElementById('play-flip').onclick=function(){flip=!flip;if(pb){pb.flip=flip;pb.set(st);}};
    document.getElementById('play-undo').onclick=function(){
      if(hist.length<2)return;
      hist.pop();hist.pop();
      st=E.pf(E.START_FEN);
      for(var i=0;i<hist.length;i++){
        var ms=E.gl(st);
        for(var j=0;j<ms.length;j++){
          var sn=E.m2s(st,ms[j]);
          if(sn===hist[i]||E.uci(ms[j])===hist[i]){E.mm(st,ms[j]);break;}
        }
      }
      if(pb)pb.set(st);ghist();gstat();
    };
  }

  function init(){load();binit();wire();show('screen-home');}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
