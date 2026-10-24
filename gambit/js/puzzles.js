// Gambit - Tactical Puzzles
const Puzzles = [
    {
        id: 1,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
        solution: ["Bg5"],
        description: "Find a pin!",
        theme: "Pin",
        rating: 400
    },
    {
        id: 2,
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
        solution: ["Bb5"],
        description: "Develop with a purpose",
        theme: "Development",
        rating: 400
    },
    {
        id: 3,
        fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1",
        solution: ["Nxe5"],
        description: "Capture the pawn safely?",
        theme: "Tactics",
        rating: 450
    },
    {
        id: 4,
        fen: "r1bqkbnr/pppp1Qpp/2n5/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 1",
        solution: ["Be7"],
        description: "Black to move - defend against mate",
        theme: "Defense",
        rating: 500
    },
    {
        id: 5,
        fen: "6k1/5ppp/8/8/8/8/1r3PPP/4R1K1 w - - 0 1",
        solution: ["Rxe8#"],
        description: "Checkmate in 1!",
        theme: "Mate in 1",
        rating: 500
    },
    {
        id: 6,
        fen: "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 1",
        solution: ["Bg5"],
        description: "Pin the knight",
        theme: "Pin",
        rating: 550
    },
    {
        id: 7,
        fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 1",
        solution: ["cxd5"],
        description: "Recapture correctly",
        theme: "Pawn Play",
        rating: 550
    },
    {
        id: 8,
        fen: "2r3k1/pp3ppp/8/3Q4/8/8/PPP2PPP/1K6 w - - 0 1",
        solution: ["Qxc8+"],
        description: "Win material with check",
        theme: "Fork",
        rating: 600
    },
    {
        id: 9,
        fen: "r1b1k2r/ppppqppp/5n2/2b5/2B1P3/2N2N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
        solution: ["Bxf7+"],
        description: "Greek gift style sacrifice",
        theme: "Sacrifice",
        rating: 650
    },
    {
        id: 10,
        fen: "6k1/pp3ppp/8/8/3q4/8/PP3PPP/4R1K1 w - - 0 1",
        solution: ["Re8+", "Kf8", "Rxe8#"],
        description: "Mate in 2",
        theme: "Mate in 2",
        rating: 700
    },
    {
        id: 11,
        fen: "r2qkb1r/ppp2ppp/2n5/3pPb2/8/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 0 1",
        solution: ["Nxe5"],
        description: "Fork the knight and bishop",
        theme: "Fork",
        rating: 700
    },
    {
        id: 12,
        fen: "r1bq1rk1/ppppbppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w - - 0 1",
        solution: ["Ng5"],
        description: "Attack the f7 pawn",
        theme: "Attack",
        rating: 750
    },
    {
        id: 13,
        fen: "8/8/8/4k3/8/4K3/4P3/8 w - - 0 1",
        solution: ["Kd4"],
        description: "Opposition - win the pawn race",
        theme: "Endgame",
        rating: 800
    },
    {
        id: 14,
        fen: "r4rk1/ppp2ppp/3p4/2b5/2B1P1n1/2N2N2/PPP2PPP/R1B2RK1 w - - 0 1",
        solution: ["Bxf7+"],
        description: "Discovered attack opportunity",
        theme: "Discovered Attack",
        rating: 850
    },
    {
        id: 15,
        fen: "3r3k/pp3ppp/8/8/3Q4/8/PPP2PPP/6K1 w - - 0 1",
        solution: ["Qh4+", "Kg8", "Qxh7#"],
        description: "Smothered mate pattern",
        theme: "Mate in 2",
        rating: 900
    },
    {
        id: 16,
        fen: "r1b2rk1/ppppqppp/2n2n2/2b5/2B1P3/3P1N2/PPP1NPPP/R1BQ1RK1 w - - 0 1",
        solution: ["Ng5"],
        description: "Greek Gift setup",
        theme: "Attack",
        rating: 950
    },
    {
        id: 17,
        fen: "6k1/5ppp/4Q3/8/8/8/5PPP/6K1 w - - 0 1",
        solution: ["Qe8+", "Kh7", "Qxf7#"],
        description: "Back rank mate",
        theme: "Mate in 2",
        rating: 1000
    },
    {
        id: 18,
        fen: "r2q1rk1/ppp2ppp/2n1bn2/3pp3/3PP3/2N1BN2/PPP2PPP/R2Q1RK1 w - - 0 1",
        solution: ["dxe5"],
        description: "Break the center",
        theme: "Pawn Break",
        rating: 1050
    },
    {
        id: 19,
        fen: "2kr3r/ppp2ppp/2n5/3q4/3P4/2N5/PPP2PPP/R2Q1RK1 w - - 0 1",
        solution: ["Bb5"],
        description: "Pin the queen",
        theme: "Pin",
        rating: 1100
    },
    {
        id: 20,
        fen: "8/pp4pp/2k5/2P5/1P6/2K5/8/8 w - - 0 1",
        solution: ["b5+"],
        description: "Zugzwang - force the win",
        theme: "Endgame",
        rating: 1200
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Puzzles;
}
