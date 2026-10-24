var Lessons=[
{id:1,title:"Board and pieces",body:"<h3>Board</h3><p>The board has 8x8 squares. Always have a light square on the right for the side to move from the starting view.</p><h3>Pieces</h3><ul><li>King - most important</li><li>Queen - strongest</li><li>Rook - straight lines</li><li>Bishop - diagonals</li><li>Knight - L shape, jumps</li><li>Pawn - moves forward, captures diagonal</li></ul>"},
{id:2,title:"Moves",body:"<h3>Rules</h3><ul><li>Only move to empty or capture</li><li>Cannot move into check</li><li>King must not stay in check</li></ul><h3>Special</h3><ul><li>Castling - king and rook move together once</li><li>En passant - rare pawn capture</li><li>Promotion - pawn becomes queen/rook/bishop/knight on last rank</li></ul>"},
{id:3,title:"Check and end of game",body:"<h3>Check</h3><p>King is under attack. You must get out of check.</p><h3>Checkmate</h3><p>No way to get out of check - game over.</p><h3>Draw</h3><ul><li>Stalemate - no moves but not in check</li><li>Not enough material</li><li>Three times same position</li><li>Fifty moves with no pawn move or capture</li></ul>"},
{id:4,title:"Opening ideas",body:"<h3>Simple goals</h3><ul><li>Develop knights and bishops</li><li>Fight for the center</li><li>Keep king safe (castle)</li><li>Don't move same piece twice</li><li>Don't bring queen out too early</li></ul>"},
{id:5,title:"Tactics 1: Fork",body:"<h3>Fork</h3><p>One piece attacks two things at the same time. Knights are great at this.</p><p>Always ask: can I attack two pieces with one move?</p>"},
{id:6,title:"Tactics 2: Pin",body:"<h3>Pin</h3><p>A piece can't move without exposing something behind it.</p><p>Look along lines of rooks, bishops, queens.</p>"},
{id:7,title:"Tactics 3: Skewer and discovered",body:"<h3>Skewer</h3><p>Like a pin backwards - attack the more valuable piece first.</p><h3>Discovered attack</h3><p>Move one piece to uncover an attack from behind.</p>"},
{id:8,title:"Safety first",body:"<h3>Before you move</h3><ul><li>What did opponent just do?</li><li>Am I hanging anything?</li><li>Am I walking into check?</li><li>Is there a simple threat?</li></ul>"},
{id:9,title:"Planning",body:"<h3>Keep it simple</h3><ul><li>Improve worst piece</li><li>Put rooks on open lines</li><li>Look for pawn breaks</li><li>Don't attack until ready</li></ul>"},
{id:10,title:"Endgame basics",body:"<h3>Ideas</h3><ul><li>King becomes stronger</li><li>Push passed pawns</li><li>Know king+queen vs king and king+rook vs king</li><li>Opposition matters</li></ul>"},
{id:11,title:"Pawns",body:"<h3>Types</h3><ul><li>Passed - can run</li><li>Isolated - alone</li><li>Doubled - same file</li><li>Backward - stuck</li></ul><p>Fix weaknesses or attack opponent's.</p>"},
{id:12,title:"Pieces trade",body:"<h3>When to trade</h3><ul><li>If ahead in material, trade pieces</li><li>If cramped, avoid trades</li><li>If attacking, keep pieces on board</li></ul>"},
{id:13,title:"Common traps",body:"<h3>Watch for</h3><ul><li>Scholar's mate style traps</li><li>Greedy pawn grabs</li><li>Moving king too early</li><li>Leaving back rank open</li></ul>"},
{id:14,title:"Calculation",body:"<h3>Method</h3><ol><li>Checks</li><li>Captures</li><li>Threats</li><li>Other moves</li></ol><p>Go one or two replies deep at first.</p>"},
{id:15,title:"Put it together",body:"<h3>Routine</h3><ul><li>Look at threats</li><li>Find safe moves</li><li>Check for tactics</li><li>Pick simplest good move</li></ul>"},
{id:16,title:"Attacking",body:"<h3>Rules</h3><ul><li>Need enough pieces</li><li>Open lines help</li><li>Don't sac without reason</li><li>Watch counterplay</li></ul>"},
{id:17,title:"Defense",body:"<h3>How</h3><ul><li>Block, move, or capture</li><li>Ask what changes after opponent move</li><li>Look for trades to stop attack</li></ul>"},
{id:18,title:"Bishop vs knight",body:"<h3>General</h3><ul><li>Open board - bishop often better</li><li>Closed board - knight often better</li><li>Pawns on both sides can favor bishop</li></ul>"},
{id:19,title:"Rooks",body:"<h3>Use them</h3><ul><li>Open files</li><li>Seventh rank</li><li>Double rooks on file</li><li>Don't rush them out</li></ul>"},
{id:20,title:"To 2500",body:"<h3>Long game</h3><ul><li>Fix one thing per game</li><li>Do puzzles daily</li><li>Play longer games</li><li>Look at your own mistakes</li><li>Slow down when tense</li></ul><p>Consistency beats cramming.</p>"}
];
if(typeof module!=='undefined'&&module.exports)module.exports=Lessons;
if(typeof window!=='undefined')window.Lessons=Lessons;
