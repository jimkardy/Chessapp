'use strict';
var Quizzes=[
{id:1,title:"Basics",questions:[
{q:"How many squares are on a chessboard?",a:["32","64","48"],c:1},
{q:"Who moves first?",a:["Black","White","A coin toss decides every game"],c:1},
{q:"The point of chess is to...",a:["Capture all the pieces","Checkmate the king","Promote a pawn"],c:1}
]},
{id:2,title:"Piece values",questions:[
{q:"A pawn is worth roughly...",a:["1 point","3 points","9 points"],c:0},
{q:"A knight or bishop is worth roughly...",a:["1 point","3 points","9 points"],c:1},
{q:"A queen is worth roughly...",a:["3 points","5 points","9 points"],c:2},
{q:"A rook is worth roughly...",a:["3 points","5 points","9 points"],c:1}
]},
{id:3,title:"How pieces move",questions:[
{q:"Which piece jumps over other pieces?",a:["Bishop","Knight","Rook"],c:1},
{q:"A bishop always moves on...",a:["Diagonals","Straight lines","Any direction one square"],c:0},
{q:"A rook moves on...",a:["Diagonals","Straight lines only","Zigzags"],c:1},
{q:"The pawn captures...",a:["Straight ahead","Diagonally","Backwards"],c:1}
]},
{id:4,title:"Special moves",questions:[
{q:"Castling moves the...",a:["King and rook together","Queen and king","Two rooks at once"],c:0},
{q:"En passant is a special...",a:["Pawn capture","Knight move","Draw rule"],c:0},
{q:"A pawn on the last rank can become...",a:["A queen only","A queen, rook, bishop, or knight","Anything, even a second king"],c:1}
]},
{id:5,title:"Ends of the game",questions:[
{q:"Stalemate is...",a:["A draw","A win for the stalemating side","A loss for the side with no moves, but a win overall"],c:0},
{q:"Checkmate happens when...",a:["The king is attacked and cannot escape","The king is attacked once","A player resigns"],c:0},
{q:"Threefold repetition means...",a:["Draw","White wins","Black wins"],c:0}
]},
{id:6,title:"Opening play",questions:[
{q:"Early on, fight for...",a:["The center squares","The corners","Your opponent's rook pawn"],c:0},
{q:"Castling early helps because...",a:["It shields the king","It looks impressive","It wins a pawn"],c:0},
{q:"Bringing the queen out very early is...",a:["Usually a mistake","Mandatory","Always winning"],c:0},
{q:"An opening plan could be: develop, castle, and then...",a:["Move the rooks to active files","Wait for the opponent to err","Undo a move"],c:0}
]},
{id:7,title:"Tactics",questions:[
{q:"A fork attacks...",a:["Two things with one move","Only the king","A square, not a piece"],c:0},
{q:"A pin freezes a piece because...",a:["Moving it exposes something more valuable behind it","It is blocked by a pawn","Pawns surround it"],c:0},
{q:"A skewer attacks...",a:["The front piece so the back one can be taken","The king only","An empty square"],c:0},
{q:"A discovered attack is when...",a:["One piece moves and reveals another's attack","You find a hanging pawn","The opponent blunders a mate"],c:0}
]},
{id:8,title:"Safety first",questions:[
{q:"Before any plan, first check...",a:["What your opponent's last move threatens","How fast you can castle","The move count"],c:0},
{q:"A 'loose' piece is one that is...",a:["Unprotected (and too easy to trap)","Promoted","On the first rank"],c:0},
{q:"If you are in check, you must...",a:["Get out of check right away","Ignore it and attack","Skip the move"],c:0},
{q:"Counting attackers vs defenders on a square tells you...",a:["Whether you can safely capture it","Nothing useful","Who castles faster"],c:0}
]},
{id:9,title:"Trading pieces",questions:[
{q:"If you are up material, it is usually good to...",a:["Trade pieces but not pawns","Avoid all trades","Sacrifice more material"],c:0},
{q:"If your position is cramped...",a:["Trade some pieces and free space","Trade all your pawns","Nothing helps a cramped position"],c:0},
{q:"When attacking the king...",a:["Keep your attackers","Trade your queen early","Trade both rooks for knights"],c:0},
{q:"When defending against an attack...",a:["Trade the main attacker away","Open the kingside yourself","Always decline to trade"],c:0}
]},
{id:10,title:"Endgames",questions:[
{q:"In the endgame, the king is usually...",a:["A strong, active piece","A piece to hide all game","Forbidden from moving"],c:0},
{q:"A passed pawn is one that...",a:["No enemy pawn can capture or block","Crossed half of the board","Was promoted"],c:0},
{q:"A simple way to convert extra material is to...",a:["Trade pieces toward an easy endgame","Ignore material and attack","Trade all your pawns away"],c:0},
{q:"Which pair alone can checkmate a lone king?",a:["King + rook","King + bishop only","King + one knight only"],c:0}
]}
];
if(typeof module!=='undefined'&&module.exports)module.exports=Quizzes;
if(typeof window!=='undefined')window.Quizzes=Quizzes;
