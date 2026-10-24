'use strict';
/* Tiny opening book. Lines are SAN sequences. Maps position -> next moves. */
(function(){
  var E=window.ChessEngine;
  var LINES=[
    ['e4','e5','Nf3','Nc6','Bc4','Bc5','c3','Nf6','d3'],
    ['e4','e5','Nf3','Nc6','Bb5','a6','Ba4','Nf6','O-O'],
    ['e4','e5','Nf3','Nf6','Nxe5','d6','Nf3','Nxe4','d4'],
    ['e4','e5','Bc4','Nf6','d3','c6','Nf3','d5','Bb3'],
    ['e4','c5','Nf3','d6','d4','cxd5','Nxd5','Nf6'],
    ['e4','c5','Nf3','Nc6','d4','cxd5','Nxd5','g6'],
    ['e4','e6','d4','d5','Nc3','Nf6','e5','Nfd7'],
    ['e4','c6','d4','d5','Nc3','dxe4','Nxe4','Bf5'],
    ['e4','d5','exd5','Qxd5','Nc3','Qa5','d4','Nf6'],
    ['e4','Nf6','e5','Nd5','d4','d6','Nf3','dxe5'],
    ['d4','d5','c4','e6','Nc3','Nf6','Nf3','Be7'],
    ['d4','d5','c4','c6','Nf3','Nf6','Nc3','e6'],
    ['d4','d5','c4','dxc4','Nf3','Nf6','e3','e6'],
    ['d4','Nf6','c4','e6','Nf3','b6','Nc3','Bb7'],
    ['d4','Nf6','c4','e6','Nc3','Bb4','e3','O-O'],
    ['d4','Nf6','c4','g6','Nc3','Bg7','e4','d6'],
    ['d4','d5','Nf3','Nf6','c4','e6','Nc3','c6'],
    ['Nf3','d5','d4','Nf6','c4','e6','Nc3','Be7'],
    ['e4','e5','Nc3','Nf6','f4','d5','fxe5','Nxe4'],
    ['e4','e5','f4','exf4','Nf3','g5','h4','g4'],
    ['d4','e6','c4','f5','Nc3','Nf6','Nf3','e6'],
    ['c4','e5','Nc3','Nf6','Nf3','Nc6','g3','d5'],
    ['Nf3','Nf6','c4','e6','Nc3','d5','d4','Be7'],
    ['e4','e5','Nf3','Nc6','d4','exd4','Nxd4','Nf6'],
    ['e4','e5','Nf3','Nc6','Nc3','Nf6','d4','exd4']
  ];
  var map={};
  var startKey=E.positionKey(E.parseFen(E.START_FEN));
  LINES.forEach(function(line){
    if(!map[startKey])map[startKey]=[];
    if(map[startKey].indexOf(line[0])<0)map[startKey].push(line[0]);
    var st=E.parseFen(E.START_FEN),keys=[E.positionKey(st)],i;
    for(i=0;i<line.length;i++){
      var m=E.sanToMove(st,line[i]);
      if(!m)return;
      E.makeMove(st,m);
      var k=E.positionKey(st);
      if(!map[k])map[k]=[];
      if(map[k].indexOf(line[i+1]||null)<0&&i+1<line.length)map[k].push(line[i+1]);
      if(map[k].length===0&&i+1>=line.length)break;
    }
  });
  window.ChessBook={
    next:function(st){
      var k=E.positionKey(st),opts=map[k];
      if(!opts||!opts.length)return null;
      var san=opts[Math.floor(Math.random()*opts.length)];
      var m=san?E.sanToMove(st,san):null;
      return m||null;
    }
  };
})();
