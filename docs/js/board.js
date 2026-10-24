'use strict';
/* Clicking chessboard renderer. Unicode pieces, no images, no fonts to download. */
(function(){
  var E=window.ChessEngine;
  var GLYPH={p:'\u265F',n:'\u265E',b:'\u265D',r:'\u265C',q:'\u265B',k:'\u265A'};
  function BoardUI(elId,opts){
    opts=opts||{};
    this.el=document.getElementById(elId);
    this.interactive=opts.interactive!==false;
    this.onMove=opts.onMove||null;
    this.flip=false;
    this.state=null;
    this.sel=-1;
    this.selMoves=[];
    var self=this;
    this.el.addEventListener('click',function(ev){
      if(!self.interactive||!self.state)return;
      var node=ev.target;
      while(node&&node!==self.el&&!(node.dataset&&node.dataset.sq!==undefined)){
        node=node.parentNode;
      }
      if(!node||node===self.el||node.dataset.sq===undefined)return;
      self.tap(parseInt(node.dataset.sq,10));
    });
  }
  BoardUI.prototype.renderIndex=function(i){
    return this.flip?63-i:i;
  };
  BoardUI.prototype.tap=function(s){
    var st=this.state,self=this;
    if(this.sel>=0&&this.selMoves.some(function(m){return m.to===s;})){
      var mv=this.selMoves.filter(function(m){return m.to===s;})
        .reduce(function(b,m){return (b===null||m.promo==='q')?m:b;},null);
      this.sel=-1;this.selMoves=[];
      this.draw();
      if(mv&&this.onMove)this.onMove(mv);
      return;
    }
    var p=st.board[s];
    if(p&&E.pieceColor(p)===st.turn&&s!==this.sel){
      this.sel=s;
      this.selMoves=E.legalMoves(st).filter(function(m){return m.from===s;});
    }else{
      this.sel=-1;this.selMoves=[];
    }
    this.draw();
  };
  BoardUI.prototype.set=function(st){
    this.state=st;
    this.sel=-1;this.selMoves=[];
    this.draw();
  };
  BoardUI.prototype.draw=function(){
    var st=this.state,b=st?st.board:[],f,r,s,i;
    var targets={};
    for(i=0;i<this.selMoves.length;i++)targets[this.selMoves[i].to]=true;
    var html='<div class="bgrid">';
    for(i=0;i<64;i++){
      var idx=this.renderIndex(i);
      r=E.rankOf(idx);f=E.fileOf(idx);
      s=E.sqIdx(f,r);
      var light=((r+f)%2===0);
      var cls='bs'+(light?' lt':' dk');
      if(s===this.sel)cls+=' sel';
      if(targets[s])cls+=' hi';
      var cell='';
      if(b){
        var pp=b[s];
        if(pp){
          cell='<span class="'+(E.isWhite(pp)?'pw':'pb')+'">'+GLYPH[pp.toLowerCase()]+'</span>';
          if(pp.toLowerCase()==='k'&&E.inCheck(st,E.pieceColor(pp)))cls+=' chk';
        }
      }
      html+='<div class="'+cls+'" data-sq="'+s+'">'+cell+'</div>';
    }
    html+='</div>';
    this.el.innerHTML=html;
  };
  window.BoardUI=BoardUI;
})();
