// Gambit - Chess Quizzes
const Quizzes = [
    {
        id: 1,
        title: "Board Basics",
        description: "Test your knowledge of the chessboard",
        questions: [
            {
                question: "How many squares are on a chessboard?",
                options: ["32", "64", "48", "56"],
                correct: 1
            },
            {
                question: "Which square should be on the right for the white player?",
                options: ["A black square", "A white square", "Doesn't matter", "A red square"],
                correct: 1
            },
            {
                question: "How many pieces does each player start with?",
                options: ["12", "14", "16", "18"],
                correct: 2
            }
        ]
    },
    {
        id: 2,
        title: "Piece Values",
        description: "Know the worth of each piece",
        questions: [
            {
                question: "What is the value of a pawn?",
                options: ["1", "2", "3", "5"],
                correct: 0
            },
            {
                question: "What is the value of a knight?",
                options: ["1", "3", "5", "9"],
                correct: 1
            },
            {
                question: "What is the most powerful piece?",
                options: ["Rook", "Bishop", "Queen", "Knight"],
                correct: 2
            },
            {
                question: "Which piece is worth 5 points?",
                options: ["Bishop", "Knight", "Queen", "Rook"],
                correct: 3
            }
        ]
    },
    {
        id: 3,
        title: "Piece Movement",
        description: "Test how well you know piece moves",
        questions: [
            {
                question: "Which piece can jump over other pieces?",
                options: ["Bishop", "Rook", "Knight", "Queen"],
                correct: 2
            },
            {
                question: "How does a bishop move?",
                options: ["Straight", "L-shape", "Diagonally", "Any direction"],
                correct: 2
            },
            {
                question: "Which piece can promote?",
                options: ["King", "Pawn", "Rook", "Bishop"],
                correct: 1
            },
            {
                question: "How many squares can a king move?",
                options: ["Any number", "One square in any direction", "Two squares", "L-shape"],
                correct: 1
            }
        ]
    },
    {
        id: 4,
        title: "Check and Checkmate",
        description: "Understand the goal of chess",
        questions: [
            {
                question: "What is check?",
                options: ["King is under attack", "Pawn reaches end", "Game is over", "Castling happened"],
                correct: 0
            },
            {
                question: "What is checkmate?",
                options: ["King in check with no legal moves", "King is captured", "Time runs out", "Pieces are traded"],
                correct: 0
            },
            {
                question: "What is stalemate?",
                options: ["King in checkmate", "No legal moves but not in check - draw", "Player resigns", "Threefold repetition"],
                correct: 1
            }
        ]
    },
    {
        id: 5,
        title: "Special Moves",
        description: "Castling, en passant, and promotion",
        questions: [
            {
                question: "Which pieces are involved in castling?",
                options: ["Two knights", "King and rook", "Queen and bishop", "Two rooks"],
                correct: 1
            },
            {
                question: "What is en passant?",
                options: ["A special pawn capture", "Castling", "Promotion", "Checkmate"],
                correct: 0
            },
            {
                question: "To what can a pawn promote?",
                options: ["Only queen", "Queen, rook, bishop, or knight", "Only knight", "Any piece except king"],
                correct: 1
            },
            {
                question: "How many types of castling are there?",
                options: ["One", "Two", "Three", "Four"],
                correct: 1
            }
        ]
    },
    {
        id: 6,
        title: "Opening Principles",
        description: "Test your opening knowledge",
        questions: [
            {
                question: "Which area of the board is most important in the opening?",
                options: ["Corners", "Edges", "Center", "Back rank"],
                correct: 2
            },
            {
                question: "Which pieces should you develop first?",
                options: ["Rooks and queen", "Knights and bishops", "Pawns only", "King"],
                correct: 1
            },
            {
                question: "When should you castle?",
                options: ["Never", "On move 1", "To get king to safety", "Only in endgame"],
                correct: 2
            },
            {
                question: "Should you bring your queen out early?",
                options: ["Yes, always", "No, usually better to develop other pieces first", "Doesn't matter", "Only if attacking"],
                correct: 1
            }
        ]
    },
    {
        id: 7,
        title: "Tactics - Forks",
        description: "Identify fork patterns",
        questions: [
            {
                question: "What is a fork?",
                options: ["Attacking two pieces at once", "Castling", "Pinning", "Blocking"],
                correct: 0
            },
            {
                question: "Which piece is best known for forks?",
                options: ["Bishop", "Rook", "Knight", "Pawn"],
                correct: 2
            }
        ]
    },
    {
        id: 8,
        title: "Tactics - Pins",
        description: "Understanding pins",
        questions: [
            {
                question: "What is a pin?",
                options: ["Piece attacked can't move without exposing more valuable piece", "Fork", "Skewer", "Double check"],
                correct: 0
            },
            {
                question: "Which sliding pieces create pins?",
                options: ["Only rooks", "Rooks, bishops, and queens", "Only bishops", "Knights"],
                correct: 1
            },
            {
                question: "What's an absolute pin?",
                options: ["Pin to any piece", "Pin to the king (piece cannot move)", "Pin to queen", "Temporary pin"],
                correct: 1
            }
        ]
    },
    {
        id: 9,
        title: "Endgame Basics",
        description: "Essential endgame knowledge",
        questions: [
            {
                question: "In endgames, what happens to the king?",
                options: ["Stays passive", "Becomes a strong fighting piece", "Must stay put", "Is captured"],
                correct: 1
            },
            {
                question: "What is a passed pawn?",
                options: ["Pawn on edge", "Pawn with no enemy pawns blocking its path", "Doubled pawn", "Isolated pawn"],
                correct: 1
            },
            {
                question: "Minimum material for checkmate (besides king)?",
                options: ["Just a pawn", "King and queen or king and rook", "Two knights only", "King and bishop only"],
                correct: 1
            }
        ]
    },
    {
        id: 10,
        title: "Chess Strategy",
        description: "Positional understanding",
        questions: [
            {
                question: "What is prophylaxis?",
                options: ["Attacking", "Preventing opponent's threats", "Castling", "Promoting"],
                correct: 1
            },
            {
                question: "When is a knight stronger than a bishop?",
                options: ["In open positions", "In closed positions", "Always", "Never"],
                correct: 1
            },
            {
                question: "When is a bishop stronger than a knight?",
                options: ["In closed positions", "In open positions with pawns on both sides", "Always", "In pawn endgames only"],
                correct: 1
            }
        ]
    },
    {
        id: 11,
        title: "Notation and Rules",
        description: "Chess notation basics",
        questions: [
            {
                question: "What does O-O mean?",
                options: ["Kingside castling", "Queenside castling", "Checkmate", "Capture"],
                correct: 0
            },
            {
                question: "What does + mean in chess notation?",
                options: ["Check", "Checkmate", "Capture", "Castling"],
                correct: 0
            },
            {
                question: "What does # mean in chess notation?",
                options: ["Check", "Checkmate", "Promotion", "En passant"],
                correct: 1
            },
            {
                question: "What does x mean in chess notation?",
                options: ["Check", "Move", "Capture", "Castling"],
                correct: 2
            }
        ]
    },
    {
        id: 12,
        title: "Advanced Tactics",
        description: "Discovered attacks and more",
        questions: [
            {
                question: "What is a discovered attack?",
                options: ["Moving a piece to reveal attack from behind", "Fork", "Pin", "Skewer"],
                correct: 0
            },
            {
                question: "What is a discovered check?",
                options: ["Fork", "Discovered attack giving check", "Pin", "Double pawn"],
                correct: 1
            },
            {
                question: "What must you do against double check?",
                options: ["Block", "Capture one attacker", "Move the king", "Castle"],
                correct: 2
            }
        ]
    },
    {
        id: 13,
        title: "Pawn Structure",
        description: "Understand pawn formations",
        questions: [
            {
                question: "What is an isolated pawn?",
                options: ["Pawn with no adjacent pawns", "Passed pawn", "Doubled pawn", "Backward pawn"],
                correct: 0
            },
            {
                question: "What are doubled pawns?",
                options: ["Two pawns on same file", "Passed pawns", "Pawn chain", "Isolated pawns"],
                correct: 0
            }
        ]
    },
    {
        id: 14,
        title: "Middlegame Planning",
        description: "Strategic thinking",
        questions: [
            {
                question: "What is a minority attack?",
                options: ["Attacking with fewer pawns", "Majority attack", "Pawn storm", "Breakthrough"],
                correct: 0
            },
            {
                question: "When should you simplify (trade pieces)?",
                options: ["When ahead in material", "When behind", "Always", "Never"],
                correct: 0
            }
        ]
    },
    {
        id: 15,
        title: "Master Level Concepts",
        description: "Final comprehensive quiz",
        questions: [
            {
                question: "What is the most important thing to do before every move?",
                options: ["Attack", "Check opponent's threats (prophylaxis)", "Castle", "Develop"],
                correct: 1
            },
            {
                question: "In rook and pawn vs rook endgames, what is the Lucena Position?",
                options: ["A draw", "A winning technique for the side with pawn", "Stalemate", "Checkmate"],
                correct: 1
            },
            {
                question: "What is zugzwang?",
                options: ["Being forced to make a bad move", "Checkmate", "Castling", "Fork"],
                correct: 0
            },
            {
                question: "Which time control is best for improving?",
                options: ["Bullet", "Blitz", "Longer time controls (10+ minutes)", "Hyperbullet"],
                correct: 2
            }
        ]
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Quizzes;
}
