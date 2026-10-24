var Quizzes=[
{id:1,title:"Basics",questions:[
{q:"How many squares?",a:["32","64","48"],c:1},
{q:"White moves from which side?",a:["Dark square on right","Light square on right","Any"],c:1},
{q:"Pieces per side?",a:["12","16","14"],c:1}
]},
{id:2,title:"Values",questions:[
{q:"Pawn worth?",a:["1","3","5"],c:0},
{q:"Knight worth?",a:["1","3","9"],c:1},
{q:"Queen worth?",a:["5","3","9"],c:2},
{q:"Rook worth?",a:["3","5","1"],c:1}
]},
{id:3,title:"Moves",questions:[
{q:"Jumps?",a:["Bishop","Knight","Rook"],c:1},
{q:"Diagonal?",a:["Rook","Bishop","Queen"],c:1},
{q:"Straight?",a:["Bishop","Knight","Rook"],c:2}
]},
{id:4,title:"End states",questions:[
{q:"Check?",a:["King attacked","Pawn promoted","Draw"],c:0},
{q:"Checkmate?",a:["No legal move out of check","Stalemate","Draw by repetition"],c:0},
{q:"Stalemate?",a:["No move but not in check","Checkmate","Check"],c:0}
]},
{id:5,title:"Special",questions:[
{q:"Castling uses?",a:["King and rook","Two bishops","Queen and pawn"],c:0},
{q:"En passant is?",a:["Pawn capture","Knight move","Castling"],c:0},
{q:"Promotion to?",a:["Queen only","Queen/rook/bishop/knight","King"],c:1}
]},
{id:6,title:"Opening",questions:[
{q:"Focus first?",a:["Queen","Center and development","Corners"],c:1},
{q:"Develop?",a:["Knights and bishops","Rooks first","Pawns only"],c:0},
{q:"Castle for?",a:["Style","King safety","Pawn grab"],c:1}
]},
{id:7,title:"Tactics",questions:[
{q:"Fork?",a:["Two at once","One move","Pin"],c:0},
{q:"Pin?",a:["Can't move without loss","Fork","Skewer"],c:0},
{q:"Skewer?",a:["Attack front first","Fork","Pin"],c:0}
]},
{id:8,title:"Before move",questions:[
{q:"First thing?",a:["Look at opponent threat","Attack","Castle"],c:0},
{q:"Hanging piece?",a:["Unprotected","Protected","Promoted"],c:0},
{q:"Checks/captures?",a:["Look at them first","Ignore","Last"],c:0}
]},
{id:9,title:"Planning",questions:[
{q:"Trade if ahead?",a:["Often yes","Never","Always bad"],c:0},
{q:"Trade if cramped?",a:["Usually no","Yes always","Doesn't matter"],c:0},
{q:"Keep pieces if attacking?",a:["Usually yes","Trade all","Always castle"],c:0}
]},
{id:10,title:"Endgame",questions:[
{q:"King in endgame?",a:["Stronger","Weaker","Same"],c:0},
{q:"Passed pawn?",a:["Can promote path clear","Blocked","Doubled"],c:0},
{q:"Need for mate?",a:["Queen or rook vs lone king","Pawn only","Two knights only"],c:0}
]},
{id:11,title:"Pawns",questions:[
{q:"Isolated?",a:["No neighbors","Passed","Doubled"],c:0},
{q:"Doubled?",a:["Same file","Different files","Passed"],c:0},
{q:"Passed?",a:["No enemy in front","On edge","Doubled"],c:0}
]},
{id:12,title:"Files/ranks",questions:[
{q:"Open file for rooks?",a:["Yes","No","Never"],c:0},
{q:"Seventh rank?",a:["Good for rooks","Bad","Useless"],c:0},
{q:"Back rank weakness?",a:["Can be mated","Safe always","Not real"],c:0}
]},
{id:13,title:"Bishop/knight",questions:[
{q:"Open board favors?",a:["Bishop","Knight","Pawn"],c:0},
{q:"Closed board favors?",a:["Knight","Bishop","Rook"],c:0},
{q:"Bishop pair?",a:["Often good","Always bad","Useless"],c:0}
]},
{id:14,title:"Defense",questions:[
{q:"How to meet check?",a:["Move/capture/block","Ignore","Give check"],c:0},
{q:"Create counterplay?",a:["Can help","Never","Always lose"],c:0},
{q:"Simplify when under attack?",a:["Sometimes","Never","Always"],c:0}
]},
{id:15,title:"Long term",questions:[
{q:"To improve?",a:["Fix one thing per game","Play only blitz","Memorize all lines"],c:0},
{q:"Better to play?",a:["Longer games","Only bullet","Only puzzles"],c:0},
{q:"Look at?",a:["Your mistakes","Only wins","Nothing"],c:0}
]}
];
if(typeof module!=='undefined'&&module.exports)module.exports=Quizzes;
if(typeof window!=='undefined')window.Quizzes=Quizzes;
