'use strict';
/* Puzzle start positions. The best move is verified live by the built-in engine
   every time a puzzle loads, so a solution can never be stale or wrong. */
var Puzzles=[
{id:1,fen:"r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",theme:"Development",desc:"Italian game. A natural developing move attacks something."},
{id:2,fen:"6k1/5ppp/8/8/8/8/1r3PPP/4R1K1 w - - 0 1",theme:"Mate in 1",desc:"Find the checkmate right now."},
{id:3,fen:"rnbqkb1r/pppp1ppp/5n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1",theme:"Capture",desc:"Something is capturable for free."},
{id:4,fen:"r1b1k2r/ppppqppp/5n2/2b5/2B1P3/2N2N2/PPP2PPP/R1BQK2R w KQkq - 0 1",theme:"Attack",desc:"Hit the king first."},
{id:5,fen:"2r3k1/5ppp/8/8/8/8/PPP2PPP/1K2R3 w - - 0 1",theme:"Rooks",desc:"Attack the most valuable piece."},
{id:6,fen:"6k1/5p1p/8/8/8/8/PPP3PP/1K1R4 w - - 0 1",theme:"Rooks",desc:"Simple rook check first."},
{id:7,fen:"r2qkb1r/ppp2ppp/2n5/3p4/8/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 1",theme:"Capture",desc:"Take the safe material."},
{id:8,fen:"r1bq1rk1/ppppbppp/2n2n2/8/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w - - 0 1",theme:"Plan",desc:"Improve your position with one solid move."},
{id:9,fen:"3r3k/5ppp/8/8/8/8/PPP2PPP/3Q3K w - - 0 1",theme:"Capture",desc:"The rook is in sight."},
{id:10,fen:"r1b2rk1/ppppqppp/2n2n2/2b5/2B1P3/3P1N2/PPP1NPPP/R1BQ1RK1 w - - 0 1",theme:"Plan",desc:"Better square for a piece."},
{id:11,fen:"8/8/8/4k3/8/4K3/4P3/8 w - - 0 1",theme:"Endgame",desc:"King and pawn vs king. Use king support."},
{id:12,fen:"r4rk1/ppp2ppp/3p4/2b5/2B1P3/2N2N2/PPP2PPP/R1B2RK1 w - - 0 1",theme:"Plan",desc:"Place a piece on a good square."},
{id:13,fen:"6k1/5p1p/8/8/8/8/PPP3PP/2K1R3 w - - 0 1",theme:"Rooks",desc:"Check first."},
{id:14,fen:"r2q1rk1/ppp2ppp/2n5/3p4/2nPP3/2N2N2/PPP2PPP/R2Q1RK1 w - - 0 1",theme:"Pawn break",desc:"Center pawn play."},
{id:15,fen:"2kr3r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R2Q1RK1 w - - 0 1",theme:"Safety",desc:"One of these moves just works."},
{id:16,fen:"r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 1",theme:"Plan",desc:"Look for pressure on a key file or diagonal."},
{id:17,fen:"8/pp4pp/2k5/2P5/1P6/2K5/8/8 w - - 0 1",theme:"Endgame",desc:"Push the pawn with support."},
{id:18,fen:"r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",theme:"Opening",desc:"Standard, solid move."},
{id:19,fen:"r3k2r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R2QKB1R w kq - 0 1",theme:"Safety",desc:"Get the king safe one way or another."},
{id:20,fen:"5rk1/pp3ppp/8/3R4/8/8/PPP2PPP/6K1 w - - 0 1",theme:"Endgame",desc:"Active rook to its best square."},
{id:21,fen:"r3k2r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R2Q1RK1 b kq - 0 1",theme:"Capture",desc:"Black to move - something is capturable."},
{id:22,fen:"8/8/4k3/4p3/4P3/4K3/8/8 w - - 0 1",theme:"Endgame",desc:"King opposition."},
{id:23,fen:"r2q1rk1/ppp2ppp/2n5/3p4/3PP3/2N5/PPP5/R3K2R w - - 0 1",theme:"Plan",desc:"Where should this rook go?"},
{id:24,fen:"6k1/5ppp/8/8/4N3/8/5PPP/6K1 w - - 0 1",theme:"Endgame",desc:"A knight jump with bite."},
{id:25,fen:"r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",theme:"Opening",desc:"The classic king safety move."},
{id:26,fen:"1k6/1p3ppp/8/8/8/8/PPP2PPP/1K6 w - - 0 1",theme:"Endgame",desc:"Improve the king or make a passed pawn."},
{id:27,fen:"rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 1",theme:"Queenside attack",desc:"Black to move. Watch the queen."},
{id:28,fen:"5k2/5p1p/5P2/5K2/8/8/8/8 w - - 0 1",theme:"Endgame",desc:"Kings battle for a key square."},
{id:29,fen:"r3r1k1/pp3ppp/2n5/3q4/3P4/2N2R2/PPP2PPP/R2Q2K1 w - - 0 1",theme:"Defense",desc:"Something of yours is attacked. Deal with it."},
{id:30,fen:"8/2k5/2P5/2K5/8/8/8/8 w - - 0 1",theme:"Endgame",desc:"Classic king and pawn duel."}
];
if(typeof module!=='undefined'&&module.exports)module.exports=Puzzles;
if(typeof window!=='undefined')window.Puzzles=Puzzles;
