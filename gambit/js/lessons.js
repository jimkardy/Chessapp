// Gambit - Chess Lessons Curriculum
// Structured to take a complete beginner to master-level understanding
const Lessons = [
    {
        id: 1,
        title: "The Chessboard and Pieces",
        description: "Learn the board layout, piece names, and values",
        content: `
            <h3>Understanding the Chessboard</h3>
            <p>Chess is played on an 8x8 board with 64 squares, alternating between light and dark colors. The board is always oriented with a white square on the right for the player with the white pieces.</p>
            
            <h3>The Pieces</h3>
            <p>Each player starts with 16 pieces. Let's learn them:</p>
            <ul>
                <li><strong>King (♔/♚)</strong> - The most important piece. If your king is checkmated, you lose. Value: Infinite</li>
                <li><strong>Queen (♕/♛)</strong> - Most powerful piece. Combines rook and bishop. Value: 9</li>
                <li><strong>Rook (♖/♜)</strong> - Moves straight horizontally and vertically. Value: 5</li>
                <li><strong>Bishop (♗/♝)</strong> - Moves diagonally. Stays on same square color. Value: 3</li>
                <li><strong>Knight (♘/♞)</strong> - The only piece that jumps over others. Moves in L-shape. Value: 3</li>
                <li><strong>Pawn (♙/♟)</strong> - The foot soldier. Moves forward, captures diagonally. Value: 1</li>
            </ul>
            
            <p>Understanding piece values helps you decide when to trade pieces.</p>
        `,
        board: null,
        moves: []
    },
    {
        id: 2,
        title: "How Pieces Move",
        description: "Master the movement of every piece",
        content: `
            <h3>Piece Movement Rules</h3>
            
            <h4>Pawn</h4>
            <ul>
                <li>Moves forward one square (or two from starting position)</li>
                <li>Captures diagonally forward one square</li>
                <li>Can promote when reaching the opposite end of the board</li>
                <li>En passant is a special capture (we'll learn later)</li>
            </ul>
            
            <h4>Knight</h4>
            <ul>
                <li>Moves in an L-shape: 2 in one direction, 1 perpendicular</li>
                <li>Only piece that can jump over other pieces</li>
                <li>Great for forks and surprise attacks</li>
            </ul>
            
            <h4>Bishop</h4>
            <ul>
                <li>Slides diagonally any number of squares</li>
                <li>Stays on the same color square for the entire game</li>
                <li>Each side has a light-squared and dark-squared bishop</li>
            </ul>
            
            <h4>Rook</h4>
            <ul>
                <li>Slides horizontally or vertically any number of squares</li>
                <li>Very powerful in open files and ranks</li>
                <li>Participates in castling</li>
            </ul>
            
            <h4>Queen</h4>
            <ul>
                <li>Combines rook and bishop - slides diagonally, horizontally, or vertically</li>
                <li>The most powerful and versatile piece</li>
                <li>Should be developed carefully</li>
            </ul>
            
            <h4>King</h4>
            <ul>
                <li>Moves one square in any direction</li>
                <li>Cannot move into check</li>
                <li>Participates in castling</li>
                <li>Your highest priority to protect</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 3,
        title: "Check, Checkmate, and Stalemate",
        description: "Learn the goal of chess and how games end",
        content: `
            <h3>Check</h3>
            <p>When a king is under attack by an opponent's piece, it's in <strong>check</strong>. The player must get out of check immediately by:</p>
            <ul>
                <li>Moving the king to a safe square</li>
                <li>Blocking the attack (if attacked by a sliding piece)</li>
                <li>Capturing the attacking piece</li>
            </ul>
            
            <h3>Checkmate</h3>
            <p><strong>Checkmate</strong> occurs when a king is in check and there is no legal move to escape. The player in checkmate loses the game. This is the ultimate goal in chess!</p>
            
            <h3>Stalemate</h3>
            <p><strong>Stalemate</strong> is when a player has no legal moves but is NOT in check. This results in a draw (tie).</p>
            
            <h3>Other Draws</h3>
            <ul>
                <li><strong>Insufficient material</strong> - Not enough pieces to checkmate (e.g., King vs King)</li>
                <li><strong>Threefold repetition</strong> - Same position occurs three times</li>
                <li><strong>50-move rule</strong> - 50 moves without pawn move or capture</li>
            </ul>
        `,
        board: "6k1/5ppp/8/8/8/8/8/R6K w - - 0 1",
        moves: [
            {move: "Ra8#", info: "Rook delivers checkmate!"}
        ]
    },
    {
        id: 4,
        title: "Special Moves: Castling, En Passant, Promotion",
        description: "Master chess's unique special moves",
        content: `
            <h3>Castling</h3>
            <p>Castling is a special move involving the king and rook. It protects the king and develops the rook.</p>
            <p><strong>Requirements for castling:</strong></p>
            <ul>
                <li>King and rook haven't moved</li>
                <li>No pieces between them</li>
                <li>King not in check, doesn't move through check, doesn't end in check</li>
            </ul>
            <p>There are two types: Kingside (O-O) and Queenside (O-O-O)</p>
            
            <h3>En Passant</h3>
            <p>A special pawn capture that can happen immediately after an opponent's pawn moves two squares forward from its starting position, passing a square your pawn attacks.</p>
            <p>You must capture en passant on the move immediately after the pawn moves two squares, or you lose the right.</p>
            
            <h3>Pawn Promotion</h3>
            <p>When a pawn reaches the last rank (8th for white, 1st for black), it must be promoted to a queen, rook, bishop, or knight.</p>
            <p>Most players promote to a queen since it's the most powerful piece, but sometimes under-promotion is necessary!</p>
        `,
        board: null,
        moves: []
    },
    {
        id: 5,
        title: "Opening Principles",
        description: "Learn how to start your games correctly",
        content: `
            <h3>The Three Golden Rules of Openings</h3>
            
            <h4>1. Develop Your Pieces</h4>
            <ul>
                <li>Get your knights and bishops out quickly</li>
                <li>Don't move the same piece multiple times in the opening</li>
                <li>Develop towards the center of the board</li>
                <li>Aim for 3-4 developed pieces by move 8-10</li>
            </ul>
            
            <h4>2. Control the Center</h4>
            <ul>
                <li>The center squares (e4, d4, e5, d5) are most important</li>
                <li>Control them with pawns and pieces</li>
                <li>Pieces in the center have more mobility</li>
            </ul>
            
            <h4>3. King Safety</h4>
            <ul>
                <li>Castle early to get your king to safety</li>
                <li>Don't move pawns in front of your castled king unnecessarily</li>
                <li>Don't bring your queen out too early</li>
            </ul>
            
            <h3>Additional Tips</h3>
            <ul>
                <li>Connect your rooks by developing all minor pieces</li>
                <li>Don't rush to attack unless there's a clear reason</li>
                <li>Look at your opponent's threats before making your move</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 6,
        title: "Tactical Motifs: Forks",
        description: "Learn to attack multiple pieces at once",
        content: `
            <h3>What is a Fork?</h3>
            <p>A <strong>fork</strong> is a tactical pattern where one piece attacks two or more enemy pieces simultaneously. It's one of the most common and powerful tactics in chess.</p>
            
            <h3>Types of Forks</h3>
            <ul>
                <li><strong>Knight Fork</strong> - Knights are excellent forkers due to their L-shape movement</li>
                <li><strong>Pawn Fork</strong> - Pawns can fork two diagonal squares</li>
                <li><strong>Queen/Bishop/Rook Fork</strong> - Sliding pieces can also create forks</li>
                <li><strong>Royal Fork</strong> - Forking the king and queen (especially powerful)</li>
            </ul>
            
            <h3>How to Spot Forks</h3>
            <p>Always look for opportunities where one of your pieces can attack multiple enemy pieces. Pay special attention to:</p>
            <ul>
                <li>Attacking the king and another piece (forces king to move, you win the other piece)</li>
                <li>Forking two valuable pieces</li>
                <li>Using knights for unexpected forks</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 7,
        title: "Tactical Motifs: Pins",
        description: "Restrict enemy pieces with pins",
        content: `
            <h3>What is a Pin?</h3>
            <p>A <strong>pin</strong> occurs when a piece cannot move without exposing a more valuable piece behind it to capture. The pinned piece is "pinned" to its king or to a more valuable piece.</p>
            
            <h3>Types of Pins</h3>
            <ul>
                <li><strong>Absolute Pin</strong> - The pinned piece is shielding the king. It cannot legally move (would leave king in check)</li>
                <li><strong>Relative Pin</strong> - The pinned piece is shielding a more valuable piece (like the queen). It can move but would be losing material</li>
            </ul>
            
            <h3>Using Pins</h3>
            <p>Pins are created by sliding pieces: rooks, bishops, and queens. They can be used to:</p>
            <ul>
                <li>Restrict enemy piece movement</li>
                <li>Win material by attacking the pinned piece</li>
                <li>Create combinations with other tactics</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 8,
        title: "Tactical Motifs: Skewers",
        description: "Reverse of pins - attack valuable piece first",
        content: `
            <h3>What is a Skewer?</h3>
            <p>A <strong>skewer</strong> is like a pin in reverse. A valuable piece is attacked and forced to move, exposing a less valuable piece behind it to capture.</p>
            
            <h3>Key Differences from Pins</h3>
            <ul>
                <li><strong>Pin:</strong> Less valuable piece in front shields more valuable piece behind</li>
                <li><strong>Skewer:</strong> More valuable piece in front is attacked, moves away exposing piece behind</li>
            </ul>
            
            <h3>Creating Skewers</h3>
            <p>Like pins, skewers are created by sliding pieces (rooks, bishops, queens). The rook skewer along ranks/files and bishop along diagonals are very common.</p>
        `,
        board: null,
        moves: []
    },
    {
        id: 9,
        title: "Tactical Motifs: Discovered Attacks",
        description: "Unleash hidden power by moving a piece",
        content: `
            <h3>What is a Discovered Attack?</h3>
            <p>A <strong>discovered attack</strong> occurs when you move one piece and uncover an attack from another piece behind it on an enemy piece.</p>
            
            <h3>Discovered Check</h3>
            <p>A <strong>discovered check</strong> is when the discovered attack gives check to the opponent's king. This is extremely powerful because:</p>
            <ul>
                <li>The moving piece can go wherever it wants (not constrained by giving check)</li>
                <li>You can win material while giving check</li>
                <li>Often leads to winning combinations</li>
            </ul>
            
            <h3>Double Check</h3>
            <p>A <strong>double check</strong> occurs when both the moved piece AND the discovered piece give check simultaneously. Against a double check, the king MUST move (can't block or capture one of the attackers).</p>
        `,
        board: null,
        moves: []
    },
    {
        id: 10,
        title: "Endgame Fundamentals",
        description: "Learn to convert advantages to wins",
        content: `
            <h3>King and Pawn Endgames</h3>
            <p>King and pawn endgames are the most important to master. The key concepts:</p>
            <ul>
                <li><strong>Opposition</strong> - Kings facing each other with one square between. The side not to move has opposition</li>
                <li><strong>Key Squares</strong> - Squares a pawn needs to reach to promote safely</li>
                <li><strong>Outflanking</strong> - Using your king to support pawn promotion</li>
            </ul>
            
            <h3>Basic Checkmates</h3>
            <p>You must know these basic checkmates:</p>
            <ul>
                <li><strong>King and Queen vs King</strong> - Force king to edge, use queen to restrict, bring king up</li>
                <li><strong>King and Rook vs King</strong> - More methodical, requires careful technique</li>
                <li><strong>King and Two Bishops vs King</strong> - Drive to corner of bishop color, checkmate</li>
            </ul>
            
            <h3>General Endgame Principles</h3>
            <ul>
                <li>Activate your king - in endgames, king becomes a fighting piece</li>
                <li>Create passed pawns - pawns with no enemy pawns blocking</li>
                <li>Don't rush - endgames require precision</li>
                <li>Calculate pawn races carefully</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 11,
        title: "Pawn Structure",
        description: "Understand pawn chains, islands, and weaknesses",
        content: `
            <h3>Pawn Structure Basics</h3>
            <p>Pawns can't move backwards, so pawn structure is permanent. Understanding it is crucial for planning.</p>
            
            <h3>Important Concepts</h3>
            <ul>
                <li><strong>Pawn Chain</strong> - Pawns diagonally connected supporting each other</li>
                <li><strong>Isolated Pawn</strong> - Pawn with no friendly pawns on adjacent files (weak)</li>
                <li><strong>Doubled Pawns</strong> - Two pawns on same file (usually weak)</li>
                <li><strong>Passed Pawn</strong> - Pawn with no enemy pawns blocking or capturing on its path</li>
                <li><strong>Backward Pawn</strong> - Pawn behind neighbors, can't be safely advanced</li>
            </ul>
            
            <h3>Strategic Guidelines</h3>
            <ul>
                <li>Avoid creating pawn weaknesses unless you get compensation</li>
                <li>Passed pawns must be pushed (especially in endgames)</li>
                <li>Attack the opponent's pawn structure</li>
                <li>In opposite-colored bishop endgames, pawns on opposite colors are safe</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 12,
        title: "Prophylaxis and Calculation",
        description: "Think like a master - prevent threats and calculate deeply",
        content: `
            <h3>What is Prophylaxis?</h3>
            <p><strong>Prophylaxis</strong> is looking for your opponent's threats and preventing them before they become dangerous. The great champion Nimzowitsch emphasized this concept.</p>
            <p>Ask yourself: "What is my opponent trying to do?" before making your move.</p>
            
            <h3>Calculation Method</h3>
            <p>Use this systematic approach:</p>
            <ol>
                <li><strong>Look for threats</strong> - Both yours and opponent's</li>
                <li><strong>Consider candidate moves</strong> - Find 2-4 promising moves</li>
                <li><strong>Calculate forcing lines</strong> - Captures, checks, and threats first</li>
                <li><strong>Look for opponent replies</strong> - Consider all reasonable responses</li>
                <li><strong>Evaluate the resulting position</strong> - Who stands better?</li>
            </ol>
            
            <h3>Advanced Tips</h3>
            <ul>
                <li><strong>Checks, Captures, Threats (CCT)</strong> - Prioritize these in calculation</li>
                <li><strong>Horizon effect</strong> - Don't stop calculating too early</li>
                <li><strong>Blunder check</strong> - Always verify your move doesn't hang a piece</li>
                <li><strong>Quiet moves</strong> - Don't forget about non-forcing moves with ideas</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 13,
        title: "Attacking the King",
        description: "Learn to build and execute king attacks",
        content: `
            <h3>Prerequisites for a King Attack</h3>
            <ul>
                <li><strong>Space advantage</strong> - More room to maneuver pieces</li>
                <li><strong>Lead in development</strong> - More pieces ready to attack</li>
                <li><strong>King in center</strong> - Uncastled kings are vulnerable</li>
                <li><strong>Pawn structure</strong> - Pawns moved in front of king create weaknesses</li>
            </ul>
            
            <h3>Attack Patterns</h3>
            <ul>
                <li><strong>Greek Gift Sacrifice</strong> - Bxh7+ sacrifice to rip open kingside</li>
                <li><strong>Back Rank Weakness</strong> - Attack rook's pawn with rooks/queen</li>
                <li><strong>Fianchetto Attacks</strong> - Targeting g2/g7 or b2/b7</li>
                <li><strong>Direct Assault</strong> - Bring all pieces to bear on king</li>
            </ul>
            
            <h3>Rules for Attacking</h3>
            <ul>
                <li>Don't attack until you're ready - need enough pieces</li>
                <li>Create weaknesses before attacking</li>
                <li>Keep the initiative</li>
                <li>Watch for counterplay - opponent can attack you back</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 14,
        title: "Positional Play",
        description: "Win without tactics through superior positioning",
        content: `
            <h3>Key Positional Concepts</h3>
            <ul>
                <li><strong>Outposts</strong> - Squares protected by pawns where knights/bishops are safe and strong</li>
                <li><strong>Space</strong> - More room for your pieces to maneuver</li>
                <li><strong>Minor Piece vs Minor Piece</strong> - Bishops vs Knights considerations</li>
                <li><strong>Good Bishop vs Bad Bishop</strong> - Bishop blocked by own pawns is bad</li>
                <li><strong>Open Files</strong> - Rooks belong on open or semi-open files</li>
            </ul>
            
            <h3>Bishop vs Knight</h3>
            <ul>
                <li><strong>Open position</strong> - Bishop is usually stronger</li>
                <li><strong>Closed position</strong> - Knight is usually stronger</li>
                <li><strong>Endgame with pawns on both sides</strong> - Bishop often stronger</li>
            </ul>
            
            <h3>Strategic Planning</h3>
            <ul>
                <li>Identify imbalances in the position</li>
                <li>Create a plan based on those imbalances</li>
                <li>Improve your worst-placed piece</li>
                <li>Restrict opponent's best pieces</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 15,
        title: "Typical Middlegame Plans",
        description: "Apply your knowledge to real game situations",
        content: `
            <h3>Common Plans</h3>
            
            <h4>Attacking the Kingside</h4>
            <p>If opponent castled kingside and you have space, consider:</p>
            <ul>
                <li>g4-g5 pawn storm (only if safe)</li>
                <li>Piece play: Bg2-h3, Qd3, Ne5</li>
                <li>Sacrifices to open lines</li>
            </ul>
            
            <h4>Minority Attack</h4>
            <p>Attack with fewer pawns on queenside to create weaknesses. Common in Queen's Gambit structures.</p>
            
            <h4>Pawn Breaks</h4>
            <p>Strategic pawn moves that open lines. Examples: d4-d5, e4-e5, c4-c5. Time them carefully!</p>
            
            <h3>Middlegame Checklist</h3>
            <ol>
                <li>Look for tactical opportunities first</li>
                <li>Improve piece placement</li>
                <li>Consider pawn breaks</li>
                <li>Keep king safe</li>
                <li>Think about endgame transition</li>
            </ol>
        `,
        board: null,
        moves: []
    },
    {
        id: 16,
        title: "Practical Tips for Improvement",
        description: "A roadmap to get stronger consistently",
        content: `
            <h3>Training Routine</h3>
            <ul>
                <li><strong>Tactics (15-30 min/day)</strong> - Do puzzles every day. This gives fastest rating gains</li>
                <li><strong>Play games (30-60 min)</strong> - Play longer time controls to think deeper</li>
                <li><strong>Analysis (20-30 min)</strong> - Review your games, especially losses</li>
                <li><strong>Study (15-30 min)</strong> - Work through lessons and endgames</li>
            </ul>
            
            <h3>Important Habits</h3>
            <ul>
                <li><strong>Blunder check</strong> - Before every move, ask "Does this hang anything?"</li>
                <li><strong>Look at opponent's move</strong> - What are they threatening?</li>
                <li><strong>Play longer games</strong> - Blitz is fun but slower time controls improve faster</li>
                <li><strong>Focus on one weakness</strong> - Don't try to learn everything at once</li>
                <li><strong>Keep a game journal</strong> - Note patterns and mistakes</li>
            </ul>
            
            <h3>Resources and Mindset</h3>
            <ul>
                <li>Be patient - improvement is not linear</li>
                <li>Learn from losses more than wins</li>
                <li>Focus on understanding, not memorization</li>
                <li>Play people slightly better than you</li>
                <li>Have fun! Chess should be enjoyable</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 17,
        title: "Advanced Tactics: Combinations",
        description: "Learn to string multiple tactical ideas together",
        content: `
            <h3>What is a Combination?</h3>
            <p>A <strong>combination</strong> is a forced sequence of moves that achieves a goal (checkmate, win material) often involving sacrifices.</p>
            
            <h3>Elements of Combinations</h3>
            <ul>
                <li><strong>Initiative</strong> - You force the opponent to respond to threats</li>
                <li><strong>Forcing moves</strong> - Checks, captures, and threats</li>
                <li><strong>Sacrifice</strong> - Give up material for greater gain</li>
                <li><strong>Coordination</strong> - All pieces working together</li>
            </ul>
            
            <h3>Famous Patterns</h3>
            <ul>
                <li><strong>Smothered Mate</strong> - King trapped by own pieces, mated by knight</li>
                <li><strong>Back Rank Mate</strong> - Rook/queen mates on rank 1 or 8</li>
                <li><strong>Anastasia's Mate</strong> - Knight and rook work together</li>
                <li><strong>Arabian Mate</strong> - Knight and rook in corner</li>
            </ul>
            
            <h3>Training Combinations</h3>
            <p>Look for: forcing sequences, sacrifices that open lines, discovered checks leading to mate, and pins/skewers in combination.</p>
        `,
        board: null,
        moves: []
    },
    {
        id: 18,
        title: "Advanced Endgames: Rook Endgames",
        description: "Master the most common practical endgames",
        content: `
            <h3>Rook and Pawn vs Rook</h3>
            <p>This is one of the most important endgames. Key ideas:</p>
            <ul>
                <li><strong>Lucena Position</strong> - Winning method for pawn on 7th rank (bridge building)</li>
                <li><strong>Philidor Position</strong> - Drawing method for defender</li>
                <li><strong>Cutting off the king</strong> - Rook cuts king off from pawn</li>
            </ul>
            
            <h3>Principles</h3>
            <ul>
                <li>Active rook is better than passive rook</li>
                <li>Give check from behind the pawn if possible</li>
                <li>Use your king actively</li>
                <li>Don't rush - technique matters</li>
            </ul>
            
            <h3>Rook vs Pawn</h3>
            <ul>
                <li>If pawn is very far advanced and king far away, often a draw</li>
                <li>If defending rook can reach pawn's file, usually draw</li>
                <li>Rook pawns (a or h) are hardest to win</li>
            </ul>
        `,
        board: null,
        moves: []
    },
    {
        id: 19,
        title: "Strategic Thinking: Imbalances",
        description: "Learn to play based on position imbalances",
        content: `
            <h3>Understanding Imbalances</h3>
            <p>Every position has imbalances. Great players identify them and formulate plans. The main imbalances are:</p>
            <ul>
                <li><strong>Material</strong> - Who has more pieces/pawns?</li>
                <li><strong>Pawn Structure</strong> - Weaknesses, passed pawns, chains</li>
                <li><strong>Space</strong> - Territory control</li>
                <li><strong>Development</strong> - Who has more pieces ready?</li>
                <li><strong>King Safety</strong> - Exposed kings</li>
                <li><strong>Minor Pieces</strong> - Bishop vs Knight</li>
            </ul>
            
            <h3>Playing with Imbalances</h3>
            <ul>
                <li><strong>Extra pawn</strong> - Simplify to endgame, activate king</li>
                <li><strong>Bishop pair</strong> - Keep position open, avoid trading bishops</li>
                <li><strong>Space advantage</strong> - Don't rush, restrict opponent, look for pawn breaks</li>
                <li><strong>Attack on king</strong> - Keep pieces on board, don't trade off attackers</li>
            </ul>
            
            <h3>Steinitz's Theory</h3>
            <p>Wilhelm Steinitz established modern chess strategy: accumulate small advantages, don't attack until you have superiority. This is still relevant today!</p>
        `,
        board: null,
        moves: []
    },
    {
        id: 20,
        title: "Master Class: Putting It All Together",
        description: "Final lesson - your roadmap to continued improvement",
        content: `
            <h3>Congratulations!</h3>
            <p>You've completed the Gambit curriculum! You now understand the fundamentals, tactics, strategy, and endgames needed to reach master level.</p>
            
            <h3>Your Path Forward</h3>
            <ul>
                <li><strong>Focus on Tactics</strong> - Do 5-10 puzzles daily. This is the highest ROI activity</li>
                <li><strong>Play Regularly</strong> - Play at least a few games per week with decent time controls (10+ minutes)</li>
                <li><strong>Analyze Everything</strong> - Review every game, especially your mistakes. Learn why, not just what</li>
                <li><strong>Study Master Games</strong> - Watch/commented games of great players to absorb ideas</li>
                <li><strong>Specialize</strong> - Pick one opening for white and black to really understand</li>
            </ul>
            
            <h3>Key Principles to Remember</h3>
            <ul>
                <li><strong>Prophylaxis first</strong> - Check opponent's threats before your own ideas</li>
                <li><strong>Calculation over intuition</strong> - Verify forcing lines</li>
                <li><strong>Strategy guides tactics</strong> - Good plans create tactical opportunities</li>
                <li><strong>Endgame knowledge wins games</strong> - Most games reach endgames</li>
                <li><strong>Patience and persistence</strong> - Rating gains come in spurts</li>
            </ul>
            
            <p><strong>Remember:</strong> Chess mastery is a lifelong journey. The difference between good and great players is often just more practice, better analysis, and more experience. Keep playing, keep learning, and most importantly, keep having fun!</p>
        `,
        board: null,
        moves: []
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Lessons;
}
