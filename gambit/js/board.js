(function(){
  'use strict';
  function sym(p){
    return {K:'\u2654',Q:'\u2655',R:'\u2656',B:'\u2657',N:'\u2658',P:'\u2659',k:'\u265a',q:'\u265b',r:'\u265c',b:'\u265d',n:'\u265e',p:'\u265f'}[p]||'';
  }
  function UI(id,opts){
    opts=opts||{};
    this.el=document.getElementById(id);
    this.inter=opts.interactive!==false;
    this.flip=false;
    this.onMove=opts.onMove||null;
    this.state=null;
    this.sel=-1;
    this.legal=[];
    this.build();
  }
  UI.prototype.build=function(){
    this.el.innerHTML='';
    for(var r=0;r<8;r++) for(var f=0;f<8;f++){
      var s=document.createElement('div');
      s.className='sq '+((r+f)%2?'dark':'light');
      s.dataset.f=f;s.dataset.r=r;
      var sq=r*16+f;
      s.dataset.sq=sq;
      s.addEventListener('click',this.click.bind(this));
      this.el.appendChild(s);
    }
  };
  UI.prototype.click=function(e){
    if(!this.inter||!this.state)return;
    var t=e.target.classList.contains('sq')?e.target:e.target.parentNode;
    if(!t.classList.contains('sq'))return;
    var sq=parseInt(t.dataset.sq,10);
    if(this.sel>=0){
      var mv=this.find(this.sel,sq);
      if(mv&&this.onMove){this.onMove(mv);this.sel=-1;this.legal=[];this.draw();return;}
    }
    var p=this.state.board[sq];
    if(p){
      var c=p===p.toUpperCase()?'w':'b';
      if(c===this.state.turn&&window.ChessEngine){
        this.sel=sq;
        this.legal=window.ChessEngine.generateLegalMoves(this.state);
      }else{this.sel=-1;this.legal=[];}
    }else{this.sel=-1;this.legal=[];}
    this.draw();
  };
  UI.prototype.find=function(from,to){
    var E=window.ChessEngine; if(!E)return null;
    var ms=E.generateLegalMoves(this.state);
    for(var i=0;i<ms.length;i++){
      if(ms[i].from===from&&ms[i].to===to){
        if(this.state.board[from].toUpperCase()==='P'){
          var rk=to>>4, col=this.state.board[from]===this.state.board[from].toUpperCase()?'w':'b';
          if((col==='w'&&rk===7)||(col==='b'&&rk===0)) ms[i].promo='q';
        }
        return ms[i];
      }
    }
    return null;
  };
  UI.prototype.draw=function(){
    if(!this.state)return;
    var kids=this.el.children;
    for(var i=0;i<64;i++){
      var el=kids[i];
      el.className='sq '+((parseInt(el.dataset.r)+parseInt(el.dataset.f))%2?'dark':'light');
      el.innerHTML='';
    }
    for(var s=0;s<128;s++){
      if(s&0x88) continue;
      var p=this.state.board[s];
      if(p){
        var co=this.sqEl(s);
        if(co){var sp=document.createElement('span');sp.className='piece';sp.textContent=sym(p);co.appendChild(sp);}
      }
    }
    if(this.sel>=0){
      var se=this.sqEl(this.sel); if(se) se.classList.add('sel');
      for(var j=0;j<this.legal.length;j++){
        if(this.legal[j].from!==this.sel) continue;
        var te=this.sqEl(this.legal[j].to);
        if(!te) continue;
        if(this.state.board[this.legal[j].to]) te.classList.add('cap'); else te.classList.add('hi');
      }
    }
    if(window.ChessEngine&&window.ChessEngine.inCheck){
      if(window.ChessEngine.inCheck(this.state,this.state.turn)){
        var k=window.ChessEngine.kingSquare(this.state,this.state.turn);
        if(k>=0){var ke=this.sqEl(k); if(ke) ke.classList.add('chk');}
      }
    }
  };
  UI.prototype.sqEl=function(sq){
    var f=sq&15,r=sq>>4;
    var vf=this.flip?7-f:f;
    var vr=this.flip?7-r:r;
    return this.el.children[vr*8+vf];
  };
  UI.prototype.set=function(st){this.state=st;this.sel=-1;this.legal=[];this.draw();};
  UI.prototype.clear=function(){this.sel=-1;this.legal=[];this.draw();};
  window.BoardUI=UI;
})();
