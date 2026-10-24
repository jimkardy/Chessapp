/*
 * Gambit — chess AI
 * ------------------------------------------------------------------
 * Alpha-beta negamax with quiescence search, piece-square tables,
 * pawn structure, king safety and simple move ordering.
 */
(function (global) {
  'use strict';

  var E = global.ChessEngine ||
    (typeof require !== 'undefined' ? require('./engine.js') : null);

  var MATE = 100000;
  var INF = 1000000;

  var VALUE = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

  // Piece-square tables, written in visual order: rank 8 first, rank 1 last.
  var PST = {
    P: [
      0, 0, 0, 0, 0, 0, 0, 0,
      50, 50, 50, 50, 50, 50, 50, 50,
      10, 10, 20, 30, 30, 20, 10, 10,
      5, 5, 10, 25, 25, 10, 5, 5,
      0, 0, 0, 20, 20, 0, 0, 0,
      5, -5, -10, 0, 0, -10, -5, 5,
      5, 10, 10, -20, -20, 10, 10, 5,
      0, 0, 0, 0, 0, 0, 0, 0
    ],
    N: [
      -50, -40, -30, -30, -30, -30, -40, -50,
      -40, -20, 0, 0, 0, 0, -20, -40,
      -30, 0, 10, 15, 15, 10, 0, -30,
      -30, 5, 15, 20, 20, 15, 5, -30,
      -30, 0, 15, 20, 20, 15, 0, -30,
      -30, 5, 10, 15, 15, 10, 5, -30,
      -40, -20, 0, 5, 5, 0, -20, -40,
      -50, -40, -30, -30, -30, -30, -40, -50
    ],
    B: [
      -20, -10, -10, -10, -10, -10, -10, -20,
      -10, 0, 0, 0, 0, 0, 0, -10,
      -10, 0, 5, 10, 10, 5, 0, -10,
      -10, 5, 5, 10, 10, 5, 5, -10,
      -10, 0, 10, 10, 10, 10, 0, -10,
      -10, 10, 10, 10, 10, 10, 10, -10,
      -10, 5, 0, 0, 0, 0, 5, -10,
      -20, -10, -10, -10, -10, -10, -10, -20
    ],
    R: [
      0, 0, 0, 0, 0, 0, 0, 0,
      5, 10, 10, 10, 10, 10, 10, 5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      -5, 0, 0, 0, 0, 0, 0, -5,
      0, 0, 0, 5, 5, 0, 0, 0
    ],
    Q: [
      -20, -10, -10, -5, -5, -10, -10, -20,
      -10, 0, 0, 0, 0, 0, 0, -10,
      -10, 0, 5, 5, 5, 5, 0, -10,
      -5, 0, 5, 5, 5, 5, 0, -5,
      0, 0, 5, 5, 5, 5, 0, -5,
      -10, 5, 5, 5, 5, 5, 0, -10,
      -10, 0, 5, 0, 0, 0, 0, -10,
      -20, -10, -10, -5, -5, -10, -10, -20
    ],
    K: [
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -30, -40, -40, -50, -50, -40, -40, -30,
      -20, -30, -30, -40, -40, -30, -30, -20,
      -10, -20, -20, -20, -20, -20, -20, -10,
      20, 20, 0, 0, 0, 0, 20, 20,
      20, 30, 10, 0, 0, 10, 30, 20
    ],
    K_END: [
      -50, -40, -30, -20, -20, -30, -40, -50,
      -30, -20, -10, 0, 0, -10, -20, -30,
      -30, -10, 20, 30, 30, 20, -10, -30,
      -30, -10, 30, 40, 40, 30, -10, -30,
      -30, -10, 30, 40, 40, 30, -10, -30,
      -30, -10, 20, 30, 30, 20, -10, -30,
      -30, -30, 0, 0, 0, 0, -30, -30,
      -50, -30, -30, -30, -30, -30, -30, -50
    ]
  };

  function pstIndex(sq, color) {
    var file = sq & 15;
    var rank = sq >> 4;
    // Tables are visual (rank 8 first). White uses mirrored rank; black uses rank.
    return color === 'w' ? (7 - rank) * 8 + file : rank * 8 + file;
  }

  function boardOf(state) { return state.board; }

  /**
   * Static evaluation, always from White's point of view.
   */
  function evaluate(state) {
    var b = state.board;
    var score = 0;
    var s, p, type, color, i;

    // pawnMasks[color][file] = bitmask of ranks (0..7) holding that color's pawns
    var pawnMasks = { w: [0, 0, 0, 0, 0, 0, 0, 0], b: [0, 0, 0, 0, 0, 0, 0, 0] };
    var bishops = { w: 0, b: 0 };
    var rooks = [];
    var kings = { w: -1, b: -1 };
    var npm = 0;   // non-pawn, non-king material (phase detection)
    var pieceList = [];

    for (s = 0; s < 120; s++) {
      if ((s & 0x88) !== 0) continue;
      p = b[s];
      if (!p) continue;
      color = p === p.toUpperCase() ? 'w' : 'b';
      type = p.toUpperCase();

      score += (color === 'w' ? 1 : -1) * VALUE[type];
      pieceList.push({ type: type, color: color, sq: s });

      if (type === 'P') {
        pawnMasks[color][s & 15] |= (1 << (s >> 4));
      } else if (type === 'B') {
        bishops[color]++;
        npm += VALUE.B;
      } else if (type === 'R') {
        rooks.push({ color: color, file: s & 15 });
        npm += VALUE.R;
      } else if (type === 'Q') {
        npm += VALUE.Q;
      } else if (type === 'K') {
        kings[color] = s;
      }
    }

    var endgame = npm < 1500;

    // Piece-square terms
    for (i = 0; i < pieceList.length; i++) {
      var pc = pieceList[i];
      var table = PST[pc.type];
      if (pc.type === 'K' && endgame) table = PST.K_END;
      score += (pc.color === 'w' ? 1 : -1) * table[pstIndex(pc.sq, pc.color)];
    }

    if (bishops.w >= 2) score += 25;
    if (bishops.b >= 2) score -= 25;

    // Pawn structure
    for (var f = 0; f < 8; f++) {
      ['w', 'b'].forEach(function (c) {
        var mask = pawnMasks[c][f];
        if (!mask) return;
        var side = c === 'w' ? 1 : -1;
        var count = popcount(mask);
        if (count > 1) score -= side * 12;                       // doubled
        var adj = (f > 0 ? pawnMasks[c][f - 1] : 0) | (f < 7 ? pawnMasks[c][f + 1] : 0);
        if (!adj) score -= side * 14;                            // isolated

        // Passed pawn: no enemy pawn ahead on this or adjacent files
        var enemyMask = (f > 0 ? pawnMasks[c === 'w' ? 'b' : 'w'][f - 1] : 0) |
                        pawnMasks[c === 'w' ? 'b' : 'w'][f] |
                        (f < 7 ? pawnMasks[c === 'w' ? 'b' : 'w'][f + 1] : 0);
        for (var r = 0; r < 8; r++) {
          if (!(mask & (1 << r))) continue;
          var ahead;
          if (c === 'w') ahead = enemyMask >> (r + 1);
          else ahead = enemyMask & ((1 << r) - 1);
          if (!ahead) {
            var advance = c === 'w' ? r : 7 - r;
            if (advance >= 3) score += side * (advance - 2) * 14;
          }
        }
      });
    }

    // Rooks on open / semi-open files
    for (i = 0; i < rooks.length; i++) {
      var rk = rooks[i];
      var own = pawnMasks[rk.color][rk.file];
      var opp = pawnMasks[rk.color === 'w' ? 'b' : 'w'][rk.file];
      if (!own && !opp) score += (rk.color === 'w' ? 1 : -1) * 18;
      else if (!own) score += (rk.color === 'w' ? 1 : -1) * 9;
    }

    // King pawn shield (midgame only)
    if (!endgame) {
      ['w', 'b'].forEach(function (c) {
        var k = kings[c];
        if (k < 0) return;
        var kf = k & 15, kr = k >> 4;
        var dir = c === 'w' ? 1 : -1;
        var shield = 0;
        for (var df = -1; df <= 1; df++) {
          var ff = kf + df;
          var rr = kr + dir;
          if (ff < 0 || ff > 7 || rr < 0 || rr > 7) continue;
          if (pawnMasks[c][ff] & (1 << rr)) shield++;
        }
        score += (c === 'w' ? 1 : -1) * shield * 12;
      });
    }

    score += state.turn === 'w' ? 8 : -8;
    return score;
  }

  function popcount(x) {
    var n = 0;
    while (x) { x &= x - 1; n++; }
    return n;
  }

  // ------------------------------------------------------------- move order
  function moveScore(state, m, ply, killers) {
    var score = 0;
    if (m.captured) {
      score += 1000 + VALUE[m.captured.toUpperCase()] * 10 - VALUE[m.piece.toUpperCase()];
    }
    if (m.promo) score += 900 + VALUE[m.promo.toUpperCase()];
    if (killers && killers[ply]) {
      var k = killers[ply];
      if (k.from === m.from && k.to === m.to) score += 500;
    }
    // Prefer central pawn pushes and castling early on
    if (m.castle) score += 150;
    return score;
  }

  function orderMoves(state, moves, ply, killers) {
    for (var i = 0; i < moves.length; i++) moves[i]._s = moveScore(state, moves[i], ply, killers);
    moves.sort(function (a, b) { return b._s - a._s; });
    return moves;
  }

  // --------------------------------------------------------------- search
  function createContext(maxTime) {
    return {
      nodes: 0,
      stopped: false,
      deadline: Date.now() + maxTime,
      killers: {}
    };
  }

  function checkTime(ctx) {
    if (ctx.stopped) return true;
    if ((ctx.nodes & 1023) === 0 && Date.now() > ctx.deadline) {
      ctx.stopped = true;
    }
    return ctx.stopped;
  }

  function quiesce(state, alpha, beta, ctx, ply, qdepth) {
    ctx.nodes++;
    if (checkTime(ctx)) return 0;

    var stand = evaluate(state);
    var side = state.turn === 'w' ? 1 : -1;
    var standForSide = stand * side;

    if (standForSide >= beta) return beta;
    if (standForSide > alpha) alpha = standForSide;

    if (qdepth <= 0) return alpha;

    var moves = E.generatePseudoMoves(state, true);
    orderMoves(state, moves, ply, ctx.killers);

    for (var i = 0; i < moves.length; i++) {
      var m = moves[i];
      // Delta pruning: skip hopeless captures
      if (m.captured && standForSide + VALUE[m.captured.toUpperCase()] + 200 < alpha) continue;

      var undo = E.makeMove(state, m);
      if (E.inCheck(state, E.opposite(state.turn))) {
        E.unmakeMove(state, undo);
        continue;
      }
      var score = -quiesce(state, -beta, -alpha, ctx, ply + 1, qdepth - 1);
      E.unmakeMove(state, undo);

      if (ctx.stopped) return 0;
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  }

  function negamax(state, depth, alpha, beta, ctx, ply) {
    ctx.nodes++;
    if (checkTime(ctx)) return 0;

    if (depth <= 0) return quiesce(state, alpha, beta, ctx, ply, 4);

    // Check extension (cheap, improves tactics)
    var moves = E.generateLegalMoves(state);
    if (moves.length === 0) {
      if (E.inCheck(state, state.turn)) return -MATE + ply;
      return 0;
    }
    if (depth === 1 && moves.length === 1) depth = 2;

    orderMoves(state, moves, ply, ctx.killers);

    var best = -INF;
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i];
      var undo = E.makeMove(state, m);
      var score = -negamax(state, depth - 1, -beta, -alpha, ctx, ply + 1);
      E.unmakeMove(state, undo);

      if (ctx.stopped) return 0;
      if (score > best) best = score;
      if (score > alpha) alpha = score;
      if (alpha >= beta) {
        if (!m.captured) {
          ctx.killers[ply] = { from: m.from, to: m.to };
        }
        break;
      }
    }
    return best;
  }

  /**
   * Root search with iterative deepening.
   * Returns { move, score, depth, nodes, time, pv }.
   */
  function search(state, options) {
    options = options || {};
    var maxDepth = Math.max(1, Math.min(6, options.depth || 3));
    var maxTime = options.time || 1200;
    var ctx = createContext(maxTime);

    var rootMoves = E.generateLegalMoves(state);
    if (rootMoves.length === 0) {
      return { move: null, score: 0, depth: 0, nodes: 0, time: 0, pv: [] };
    }
    if (rootMoves.length === 1) {
      return { move: rootMoves[0], score: 0, depth: 1, nodes: 1, time: 0, pv: [rootMoves[0]] };
    }

    var bestMove = rootMoves[0];
    var bestScore = 0;
    var completedDepth = 0;
    var started = Date.now();
    var ordered = rootMoves.slice();

    for (var depth = 1; depth <= maxDepth; depth++) {
      var alpha = -INF, beta = INF;
      var localBest = null;
      var localScore = -INF;
      var scored = [];

      orderMoves(state, ordered, 0, ctx.killers);

      for (var i = 0; i < ordered.length; i++) {
        var m = ordered[i];
        var undo = E.makeMove(state, m);
        var score = -negamax(state, depth - 1, -beta, -alpha, ctx, 1);
        E.unmakeMove(state, undo);

        if (ctx.stopped) break;
        scored.push({ move: m, score: score });
        if (score > localScore) {
          localScore = score;
          localBest = m;
        }
        if (score > alpha) alpha = score;
      }

      // An aborted iteration has unreliable scores — throw it away.
      if (ctx.stopped) break;

      if (localBest) {
        // Variety: among near-equal moves, pick randomly.
        var close = scored.filter(function (x) { return x.score >= localScore - 8; });
        var pick = close[Math.floor(Math.random() * close.length)] || { move: localBest, score: localScore };
        bestMove = pick.move;
        bestScore = pick.score;
        completedDepth = depth;
        // Search the best move first next iteration.
        ordered = [bestMove].concat(ordered.filter(function (x) { return x !== bestMove; }));
      }
    }

    return {
      move: bestMove,
      score: bestScore,
      depth: completedDepth,
      nodes: ctx.nodes,
      time: Date.now() - started,
      pv: [bestMove]
    };
  }

  /**
   * Rank the legal moves for hints / puzzle checking.
   */
  function rankMoves(state, options) {
    options = options || {};
    var depth = options.depth || 2;
    var maxTime = options.time || 600;
    var ctx = createContext(maxTime);
    var moves = E.generateLegalMoves(state);
    var out = [];

    orderMoves(state, moves, 0, ctx.killers);
    for (var i = 0; i < moves.length; i++) {
      var m = moves[i];
      var undo = E.makeMove(state, m);
      var score = -negamax(state, depth - 1, -INF, INF, ctx, 1);
      E.unmakeMove(state, undo);
      if (ctx.stopped) break;
      out.push({ move: m, score: score });
    }
    out.sort(function (a, b) { return b.score - a.score; });
    return out;
  }

  // ------------------------------------------------------------- difficulty
  var LEVELS = [
    { id: 1, name: 'Beginner', depth: 1, time: 80, blunder: 0.7, elo: 'beginner' },
    { id: 2, name: 'Learner', depth: 1, time: 120, blunder: 0.5, elo: 'learner' },
    { id: 3, name: 'Intermediate', depth: 1, time: 200, blunder: 0.25, elo: 'intermediate' },
    { id: 4, name: 'Solid', depth: 2, time: 300, blunder: 0.12, elo: 'solid' },
    { id: 5, name: 'Strong', depth: 2, time: 450, blunder: 0.05, elo: 'strong' },
    { id: 6, name: 'Advanced', depth: 3, time: 650, blunder: 0, elo: 'advanced' },
    { id: 7, name: 'Master', depth: 4, time: 900, blunder: 0, elo: 'master' },
    { id: 8, name: 'Grandmaster', depth: 5, time: 1100, blunder: 0, elo: 'grandmaster' }
  ];

  function chooseMove(state, levelId, options) {
    var level = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, (levelId || 1) - 1))];
    var legal = E.generateLegalMoves(state);
    if (!legal.length) return { move: null, level: level };

    // Opening book for the stronger settings: play real openings.
    var openings = global.GambitOpenings ||
      (typeof require !== 'undefined' ? tryRequire('./openings.js') : null);
    if (openings && (!options || options.book !== false) && level.id >= 4 && state.full <= 8) {
      var bm = openings.bookMove(state);
      if (bm) {
        return {
          move: bm,
          score: 0,
          depth: 0,
          nodes: 0,
          time: 0,
          level: level,
          book: true
        };
      }
    }

    // Weak levels sometimes just play a random legal move.
    if (level.blunder && Math.random() < level.blunder) {
      return {
        move: legal[Math.floor(Math.random() * legal.length)],
        score: 0,
        depth: 0,
        nodes: 0,
        time: 0,
        level: level,
        random: true
      };
    }

    var result = search(state, { depth: level.depth, time: level.time });
    result.level = level;
    return result;
  }

  function tryRequire(path) {
    try { return require(path); } catch (e) { return null; }
  }

  var API = {
    MATE: MATE,
    VALUE: VALUE,
    LEVELS: LEVELS,
    evaluate: evaluate,
    search: search,
    rankMoves: rankMoves,
    chooseMove: chooseMove
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  global.ChessAI = API;
})(typeof window !== 'undefined' ? window : globalThis);
