(function(){
  'use strict';
  var E=window.ChessEngine;
  var LINES=[
    ['e4','e5','Nf3','Nc6','Bb5','a6'],
    ['e4','e5','Nf3','Nc6','Bc4','Bc5'],
    ['e4','e5','Nf3','Nc6','d4','exd4','Nxd4'],
    ['e4','c5','Nf3','d6','d4','cxd4','Nxd4','Nf6'],
    ['e4','e6','d4','d5','Nd2'],
    ['e4','c6','d4','d5','exd5','cxd5'],
    ['e4','d5','exd5','Qxd5','Nc3'],
    ['d4','d5','c4','dxc4','e3'],
    ['d4','d5','c4','e6','Nc3','Nf6'],
    ['d4','Nf6','c4','g6','Nc3','Bg7'],
    ['c4','e5','Nc3','Nf6','g3'],
    ['Nf3','d5','g3','Nf6','Bg2']
  ];
  var book={};
  function add(l){
    var st=E.pf(E.START_FEN);
    for(var i=0;i<l.length;i++){
      var m=E.psn(st,l[i]); if(!m)return;
      if(i%2===0){
        var k=E.pk(st); if(!book[k])book[k]=[]; if(book[k].indexOf(l[i])<0)book[k].push(l[i]);
      }
      E.mm(st,m);
    }
  }
  LINES.forEach(add);
  function bm(st){var k=E.pk(st),o=book[k]; if(!o||!o.length)return null; var s=o[Math.floor(Math.random()*o.length)]; return E.psn(st,s); }
  var API={book:book,bookMove:bm};
  if(typeof module!=='undefined'&&module.exports)module.exports=API;
  if(typeof window!=='undefined')window.GambitOpenings=API;
})();
