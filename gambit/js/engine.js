/*
 * Gambit — chess rules engine
 * ------------------------------------------------------------------
 * Board: 0x88 array of 128 squares. Square 0 = a1, 7 = h1, 112 = a8.
 * Pieces: uppercase = white, lowercase = black. Empty = null.
 *
 * No dependencies. Works as a classic <script> (window.ChessEngine)
 * or via require() in Node for tests.
 */
(function (global) {
  'use strict';

  var START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  var FILES = 'abcdefgh';

  var KNIGHT_OFFSETS = [33, 31, 18, 14, -14, -18, -31, -33];
  var BISHOP_OFFSETS = [17, 15, -15, -17];
  var ROOK_OFFSETS = [16, -16, 1, -1];
  var KING_OFFSETS = [17, 16, 15, 1, -1, -15, -16, -17];

  // ---------------------------------------------------------------- squares
  function sq(file, rank) { return rank * 16 + file; }
  function fileOf(s) { return s & 15; }
  function rankOf(s) { return s >> 4; }
  function onBoard(s) { return (s & 0x88) === 0 && s >= 0 && s <= 119; }
  function algebraic(s) { return FILES[fileOf(s)] + (rankOf(s) + 1); }
  function fromAlgebraic(str) {
    if (typeof str !== 'string' || str.length < 2) return -1;
    var f = FILES.indexOf(str[0].toLowerCase());
    var r = parseInt(str[1], 10) - 1;
    if (f < 0 || r < 0 || r > 7) return -1;
    return sq(f, r);
  }
  function isWhitePiece(p) { return !!p && p === p.toUpperCase(); }
  function pieceColor(p) { return !p ? null : (p === p.toUpperCase() ? 'w' : 'b'); }
  function opposite(color) { return color === 'w' ? 'b' : 'w'; }

  // ------------------------------------------------------------------ state
  function emptyBoard() {
    var b = new Array(128);
    for (var i = 0; i < 128; i++) b[i] = null;
    return b;
  }

  function parseFen(fen) {
    fen = (fen || START_FEN).trim();
    var parts = fen.split(/\s+/);
    var board = emptyBoard();
    var rows = parts[0].split('/');
    if (rows.length !== 8) throw new Error('Invalid FEN: ' + fen);
    for (var r = 0; r < 8; r++) {
      var rank = 7 - r;
      var file = 0;
      for (var i = 0; i < rows[r].length; i++) {
        var ch = rows[r][i];
        if (/[1-8]/.test(ch)) {
          file += parseInt(ch, 10);
        } else if (/[prnbqkPRNBQK]/.test(ch)) {
          if (file > 7) throw new Error('Invalid FEN rank: ' + rows[r]);
          board[sq(file, rank)] = ch;
          file++;
        } else {
          throw new Error('Invalid FEN character: ' + ch);
        }
      }
      if (file !== 8) throw new Error('Invalid FEN rank width: ' + rows[r]);
    }

    var castleStr = parts[2] || '-';
    var ep = parts[3] && parts[3] !== '-' ? fromAlgebraic(parts[3]) : -1;
    if (ep >= 0 && !onBoard(ep)) ep = -1;

    return {
      board: board,
      turn: parts[1] === 'b' ? 'b' : 'w',
      castling: {
        K: castleStr.indexOf('K') >= 0,
        Q: castleStr.indexOf('Q') >= 0,
        k: castleStr.indexOf('k') >= 0,
        q: castleStr.indexOf('q') >= 0
      },
      ep: ep,
      half: parts[4] ? parseInt(parts[4], 10) || 0 : 0,
      full: parts[5] ? parseInt(parts[5], 10) || 1 : 1
    };
  }

  function castlingString(state) {
    var c = state.castling, s = '';
    if (c.K) s += 'K';
    if (c.Q) s += 'Q';
    if (c.k) s += 'k';
    if (c.q) s += 'q';
    return s || '-';
  }

  function toFen(state) {
    var out = '';
    for (var rank = 7; rank >= 0; rank--) {
      var empty = 0;
      for (var file = 0; file < 8; file++) {
        var p = state.board[sq(file, rank)];
        if (!p) { empty++; continue; }
        if (empty) { out += empty; empty = 0; }
        out += p;
      }
      if (empty) out += empty;
      if (rank > 0) out += '/';
    }
    var ep = state.ep >= 0 ? algebraic(state.ep) : '-';
    return out + ' ' + state.turn + ' ' + castlingString(state) + ' ' + ep + ' ' +
      state.half + ' ' + state.full;
  }

  // Position identity for repetition detection (no clocks).
  function positionKey(state) {
    var out = '';
    for (var rank = 7; rank >= 0; rank--) {
      var empty = 0;
      for (var file = 0; file < 8; file++) {
        var p = state.board[sq(file, rank)];
        if (!p) { empty++; continue; }
        if (empty) { out += empty; empty = 0; }
        out += p;
      }
      if (empty) out += empty;
      if (rank > 0) out += '/';
    }
    return out + ' ' + state.turn + ' ' + castlingString(state) + ' ' +
      (state.ep >= 0 ? algebraic(state.ep) : '-');
  }

  function cloneState(state) {
    return {
      board: state.board.slice(),
      turn: state.turn,
      castling: {
        K: state.castling.K, Q: state.castling.Q,
        k: state.castling.k, q: state.castling.q
      },
      ep: state.ep,
      half: state.half,
      full: state.full
    };
  }

  // ------------------------------------------------------------------ moves
  // A move: { from, to, piece, captured, promo, ep, castle, double }
  function move(from, to, piece, captured, promo, flags) {
    var m = { from: from, to: to, piece: piece, captured: captured || null, promo: promo || null };
    if (flags) {
      m.ep = !!flags.ep;
      m.castle = flags.castle || null;   // 'K' | 'Q'
      m.double = !!flags.double;
    }
    return m;
  }

  function addPawnMove(moves, from, to, piece, captured, flags) {
    var promoRank = pieceColor(piece) === 'w' ? 7 : 0;
    if (rankOf(to) === promoRank) {
      var promos = ['q', 'r', 'b', 'n'];
      for (var i = 0; i < 4; i++) {
        moves.push(move(from, to, piece, captured, promos[i], flags));
      }
    } else {
      moves.push(move(from, to, piece, captured, null, flags));
    }
  }

  function generatePseudoMoves(state, capturesOnly) {
    var moves = [];
    var us = state.turn;
    var them = opposite(us);
    var board = state.board;

    for (var s = 0; s < 120; s++) {
      if (!onBoard(s)) continue;
      var p = board[s];
      if (!p || pieceColor(p) !== us) continue;

      var type = p.toUpperCase();
      var i, to, off, target;

      if (type === 'P') {
        var dir = us === 'w' ? 16 : -16;
        var startRank = us === 'w' ? 1 : 6;

        if (!capturesOnly) {
          to = s + dir;
          if (onBoard(to) && !board[to]) {
            addPawnMove(moves, s, to, p, null, null);
            if (rankOf(s) === startRank) {
              var to2 = s + dir * 2;
              if (!board[to2]) addPawnMove(moves, s, to2, p, null, { double: true });
            }
          }
        }

        var caps = [s + dir - 1, s + dir + 1];
        for (i = 0; i < 2; i++) {
          to = caps[i];
          if (!onBoard(to)) continue;
          target = board[to];
          if (target && pieceColor(target) === them) {
            addPawnMove(moves, s, to, p, target, null);
          } else if (to === state.ep && !target) {
            var capturedSq = to - dir;
            if (board[capturedSq] && board[capturedSq].toUpperCase() === 'P') {
              moves.push(move(s, to, p, board[capturedSq], null, { ep: true }));
            }
          }
        }
        continue;
      }

      if (type === 'N' || type === 'K') {
        var offsets = type === 'N' ? KNIGHT_OFFSETS : KING_OFFSETS;
        for (i = 0; i < 8; i++) {
          to = s + offsets[i];
          if (!onBoard(to)) continue;
          target = board[to];
          if (!target) {
            if (!capturesOnly) moves.push(move(s, to, p, null, null, null));
          } else if (pieceColor(target) === them) {
            moves.push(move(s, to, p, target, null, null));
          }
        }
        if (type === 'K' && !capturesOnly) addCastling(state, moves, s, p);
        continue;
      }

      var dirs = type === 'B' ? BISHOP_OFFSETS :
        type === 'R' ? ROOK_OFFSETS : KING_OFFSETS;
      for (i = 0; i < dirs.length; i++) {
        off = dirs[i];
        to = s + off;
        while (onBoard(to)) {
          target = board[to];
          if (!target) {
            if (!capturesOnly) moves.push(move(s, to, p, null, null, null));
          } else {
            if (pieceColor(target) === them) moves.push(move(s, to, p, target, null, null));
            break;
          }
          to += off;
        }
      }
    }
    return moves;
  }

  function addCastling(state, moves, kingSq, kingPiece) {
    var us = state.turn;
    var board = state.board;
    var home = us === 'w' ? sq(4, 0) : sq(4, 7);
    if (kingSq !== home) return;
    if (isAttacked(state, home, opposite(us))) return;

    if (state.castling[us === 'w' ? 'K' : 'k']) {
      var f1 = us === 'w' ? sq(5, 0) : sq(5, 7);
      var g1 = us === 'w' ? sq(6, 0) : sq(6, 7);
      var rookSq = us === 'w' ? sq(7, 0) : sq(7, 7);
      var rook = board[rookSq];
      if (rook && rook.toUpperCase() === 'R' && pieceColor(rook) === us &&
          !board[f1] && !board[g1] &&
          !isAttacked(state, f1, opposite(us)) &&
          !isAttacked(state, g1, opposite(us))) {
        moves.push(move(kingSq, g1, kingPiece, null, null, { castle: 'K' }));
      }
    }
    if (state.castling[us === 'w' ? 'Q' : 'q']) {
      var d1 = us === 'w' ? sq(3, 0) : sq(3, 7);
      var c1 = us === 'w' ? sq(2, 0) : sq(2, 7);
      var b1 = us === 'w' ? sq(1, 0) : sq(1, 7);
      var rookSq2 = us === 'w' ? sq(0, 0) : sq(0, 7);
      var rook2 = board[rookSq2];
      if (rook2 && rook2.toUpperCase() === 'R' && pieceColor(rook2) === us &&
          !board[d1] && !board[c1] && !board[b1] &&
          !isAttacked(state, d1, opposite(us)) &&
          !isAttacked(state, c1, opposite(us))) {
        moves.push(move(kingSq, c1, kingPiece, null, null, { castle: 'Q' }));
      }
    }
  }

  function isAttacked(state, target, by) {
    var board = state.board;
    var i, s, p;

    // Pawns
    if (by === 'w') {
      var pw = [target - 15, target - 17];
      for (i = 0; i < 2; i++) {
        s = pw[i];
        if (onBoard(s) && board[s] === 'P') return true;
      }
    } else {
      var pb = [target + 15, target + 17];
      for (i = 0; i < 2; i++) {
        s = pb[i];
        if (onBoard(s) && board[s] === 'p') return true;
      }
    }

    // Knights
    for (i = 0; i < 8; i++) {
      s = target + KNIGHT_OFFSETS[i];
      if (onBoard(s)) {
        p = board[s];
        if (p && (p === 'N' || p === 'n') && pieceColor(p) === by) return true;
      }
    }

    // King
    for (i = 0; i < 8; i++) {
      s = target + KING_OFFSETS[i];
      if (onBoard(s)) {
        p = board[s];
        if (p && (p === 'K' || p === 'k') && pieceColor(p) === by) return true;
      }
    }

    // Sliding: bishops/queens
    for (i = 0; i < 4; i++) {
      s = target + BISHOP_OFFSETS[i];
      while (onBoard(s)) {
        p = board[s];
        if (p) {
          if (pieceColor(p) === by && (p === 'B' || p === 'b' || p === 'Q' || p === 'q')) return true;
          break;
        }
        s += BISHOP_OFFSETS[i];
      }
    }

    // Sliding: rooks/queens
    for (i = 0; i < 4; i++) {
      s = target + ROOK_OFFSETS[i];
      while (onBoard(s)) {
        p = board[s];
        if (p) {
          if (pieceColor(p) === by && (p === 'R' || p === 'r' || p === 'Q' || p === 'q')) return true;
          break;
        }
        s += ROOK_OFFSETS[i];
      }
    }
    return false;
  }

  function kingSquare(state, color) {
    var king = color === 'w' ? 'K' : 'k';
    for (var s = 0; s < 120; s++) {
      if (onBoard(s) && state.board[s] === king) return s;
    }
    return -1;
  }

  function inCheck(state, color) {
    color = color || state.turn;
    var k = kingSquare(state, color);
    if (k < 0) return false;
    return isAttacked(state, k, opposite(color));
  }

  // ------------------------------------------------------------- make/unmake
  function makeMove(state, m) {
    var board = state.board;
    var undo = {
      move: m,
      captured: m.captured || null,
      capturedSq: -1,
      castling: castlingString(state),
      ep: state.ep,
      half: state.half,
      full: state.full
    };

    var us = state.turn;
    var isPawn = m.piece.toUpperCase() === 'P';

    // Remove captured piece
    if (m.captured) {
      if (m.ep) {
        undo.capturedSq = m.to + (us === 'w' ? -16 : 16);
      } else {
        undo.capturedSq = m.to;
      }
      board[undo.capturedSq] = null;
    }

    // Move piece
    board[m.from] = null;
    board[m.to] = m.promo
      ? (us === 'w' ? m.promo.toUpperCase() : m.promo)
      : m.piece;

    // Castling rook move
    if (m.castle) {
      if (m.castle === 'K') {
        var rFrom = us === 'w' ? sq(7, 0) : sq(7, 7);
        var rTo = us === 'w' ? sq(5, 0) : sq(5, 7);
        board[rTo] = board[rFrom];
        board[rFrom] = null;
      } else {
        var rFrom2 = us === 'w' ? sq(0, 0) : sq(0, 7);
        var rTo2 = us === 'w' ? sq(3, 0) : sq(3, 7);
        board[rTo2] = board[rFrom2];
        board[rFrom2] = null;
      }
    }

    // Castling rights
    if (m.piece === 'K') { state.castling.K = false; state.castling.Q = false; }
    if (m.piece === 'k') { state.castling.k = false; state.castling.q = false; }
    if (m.from === sq(7, 0) || m.to === sq(7, 0)) state.castling.K = false;
    if (m.from === sq(0, 0) || m.to === sq(0, 0)) state.castling.Q = false;
    if (m.from === sq(7, 7) || m.to === sq(7, 7)) state.castling.k = false;
    if (m.from === sq(0, 7) || m.to === sq(0, 7)) state.castling.q = false;

    // En passant target
    state.ep = -1;
    if (isPawn && m.double) {
      state.ep = (m.from + m.to) / 2;
    }

    // Clocks
    if (isPawn || m.captured) state.half = 0;
    else state.half++;
    if (us === 'b') state.full++;

    state.turn = opposite(us);
    return undo;
  }

  function unmakeMove(state, undo) {
    var board = state.board;
    var m = undo.move;
    var us = m.piece === m.piece.toUpperCase() ? 'w' : 'b';

    board[m.to] = null;
    board[m.from] = m.piece;

    if (undo.captured) {
      board[undo.capturedSq] = undo.captured;
    }

    if (m.castle) {
      if (m.castle === 'K') {
        var rFrom = us === 'w' ? sq(7, 0) : sq(7, 7);
        var rTo = us === 'w' ? sq(5, 0) : sq(5, 7);
        board[rFrom] = board[rTo];
        board[rTo] = null;
      } else {
        var rFrom2 = us === 'w' ? sq(0, 0) : sq(0, 7);
        var rTo2 = us === 'w' ? sq(3, 0) : sq(3, 7);
        board[rFrom2] = board[rTo2];
        board[rTo2] = null;
      }
    }

    var c = undo.castling;
    state.castling.K = c.indexOf('K') >= 0;
    state.castling.Q = c.indexOf('Q') >= 0;
    state.castling.k = c.indexOf('k') >= 0;
    state.castling.q = c.indexOf('q') >= 0;
    state.ep = undo.ep;
    state.half = undo.half;
    state.full = undo.full;
    state.turn = us;
  }

  function generateLegalMoves(state) {
    var pseudo = generatePseudoMoves(state, false);
    var legal = [];
    var us = state.turn;
    for (var i = 0; i < pseudo.length; i++) {
      var undo = makeMove(state, pseudo[i]);
      if (!inCheck(state, us)) legal.push(pseudo[i]);
      unmakeMove(state, undo);
    }
    return legal;
  }

  function hasLegalMove(state) {
    var pseudo = generatePseudoMoves(state, false);
    var us = state.turn;
    for (var i = 0; i < pseudo.length; i++) {
      var undo = makeMove(state, pseudo[i]);
      var ok = !inCheck(state, us);
      unmakeMove(state, undo);
      if (ok) return true;
    }
    return false;
  }

  // ------------------------------------------------------------------- SAN
  function sameTypeMove(state, from, to, type, color) {
    var p = state.board[from];
    return p && p.toUpperCase() === type && pieceColor(p) === color && from !== to;
  }

  function moveToSan(state, m) {
    if (m.castle === 'K') return 'O-O' + checkSuffix(state, m);
    if (m.castle === 'Q') return 'O-O-O' + checkSuffix(state, m);

    var p = m.piece || state.board[m.from];
    var type = p.toUpperCase();
    var san = '';

    if (type === 'P') {
      if (m.captured) san += FILES[fileOf(m.from)] + 'x';
      san += algebraic(m.to);
      if (m.promo) san += '=' + m.promo.toUpperCase();
    } else {
      san += type;

      // Disambiguation among legal moves of the same piece type
      var legal = generateLegalMoves(state);
      var rivals = [];
      for (var i = 0; i < legal.length; i++) {
        var lm = legal[i];
        if (lm.from !== m.from && lm.to === m.to &&
            sameTypeMove(state, lm.from, m.to, type, pieceColor(p))) {
          rivals.push(lm);
        }
      }
      if (rivals.length) {
        var sameFile = false, sameRank = false;
        for (var j = 0; j < rivals.length; j++) {
          if (fileOf(rivals[j].from) === fileOf(m.from)) sameFile = true;
          if (rankOf(rivals[j].from) === rankOf(m.from)) sameRank = true;
        }
        if (!sameFile) san += FILES[fileOf(m.from)];
        else if (!sameRank) san += (rankOf(m.from) + 1);
        else san += algebraic(m.from);
      }

      if (m.captured) san += 'x';
      san += algebraic(m.to);
    }

    return san + checkSuffix(state, m);
  }

  function checkSuffix(state, m) {
    var undo = makeMove(state, m);
    var suffix = '';
    if (inCheck(state, state.turn)) {
      suffix = hasLegalMove(state) ? '+' : '#';
    }
    unmakeMove(state, undo);
    return suffix;
  }

  function parseSan(state, san) {
    san = (san || '').trim().replace(/[?!]+$/, '').replace(/[+#]$/, '');
    var legal = generateLegalMoves(state);
    for (var i = 0; i < legal.length; i++) {
      if (moveToSan(state, legal[i]).replace(/[+#]$/, '') === san) return legal[i];
    }
    // Also accept long algebraic e2e4
    if (/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(san)) {
      var from = fromAlgebraic(san.slice(0, 2));
      var to = fromAlgebraic(san.slice(2, 4));
      var promo = san[4] || null;
      for (var j = 0; j < legal.length; j++) {
        if (legal[j].from === from && legal[j].to === to &&
            (!promo || legal[j].promo === promo)) return legal[j];
      }
    }
    return null;
  }

  function uci(m) {
    return algebraic(m.from) + algebraic(m.to) + (m.promo || '');
  }

  // ----------------------------------------------------------------- status
  function insufficientMaterial(state) {
    var pieces = [];
    for (var s = 0; s < 120; s++) {
      if (!onBoard(s)) continue;
      var p = state.board[s];
      if (p && p.toUpperCase() !== 'K') pieces.push({ p: p, sq: s });
    }
    if (pieces.length === 0) return true;                       // K vs K
    if (pieces.length === 1) {
      var t = pieces[0].p.toUpperCase();
      return t === 'B' || t === 'N';                            // K+minor vs K
    }
    if (pieces.length === 2) {
      var a = pieces[0], b = pieces[1];
      if (a.p.toUpperCase() === 'B' && b.p.toUpperCase() === 'B' &&
          pieceColor(a.p) !== pieceColor(b.p)) {
        // Opposite-color bishops only draw; same-color is also dead but rare.
        return (fileOf(a.sq) + rankOf(a.sq)) % 2 === (fileOf(b.sq) + rankOf(b.sq)) % 2;
      }
    }
    return false;
  }

  /**
   * @param {object} state
   * @param {string[]} [positionKeys] repetition history (oldest first), include current
   */
  function gameStatus(state, positionKeys) {
    var legal = generateLegalMoves(state);
    if (legal.length === 0) {
      if (inCheck(state, state.turn)) {
        return {
          over: true,
          result: state.turn === 'w' ? '0-1' : '1-0',
          reason: 'checkmate',
          winner: opposite(state.turn)
        };
      }
      return { over: true, result: '1/2-1/2', reason: 'stalemate', winner: null };
    }
    if (state.half >= 100) {
      return { over: true, result: '1/2-1/2', reason: 'fifty-move rule', winner: null };
    }
    if (insufficientMaterial(state)) {
      return { over: true, result: '1/2-1/2', reason: 'insufficient material', winner: null };
    }
    if (positionKeys && positionKeys.length) {
      var key = positionKeys[positionKeys.length - 1];
      var count = 0;
      for (var i = 0; i < positionKeys.length; i++) {
        if (positionKeys[i] === key) count++;
      }
      if (count >= 3) {
        return { over: true, result: '1/2-1/2', reason: 'threefold repetition', winner: null };
      }
    }
    return {
      over: false,
      result: null,
      reason: inCheck(state, state.turn) ? 'check' : null,
      winner: null,
      legalMoves: legal
    };
  }

  // ----------------------------------------------------------------- perft
  function perft(state, depth) {
    if (depth === 0) return 1;
    var moves = generatePseudoMoves(state, false);
    var us = state.turn;
    var nodes = 0;
    for (var i = 0; i < moves.length; i++) {
      var undo = makeMove(state, moves[i]);
      if (!inCheck(state, us)) nodes += perft(state, depth - 1);
      unmakeMove(state, undo);
    }
    return nodes;
  }

  function perftDivide(state, depth) {
    var out = {};
    var moves = generateLegalMoves(state);
    for (var i = 0; i < moves.length; i++) {
      var undo = makeMove(state, moves[i]);
      out[moveToSan(state, moves[i])] = perft(state, depth - 1);
      unmakeMove(state, undo);
    }
    return out;
  }

  // ------------------------------------------------------------------- API
  var API = {
    START_FEN: START_FEN,
    sq: sq,
    fileOf: fileOf,
    rankOf: rankOf,
    onBoard: onBoard,
    algebraic: algebraic,
    fromAlgebraic: fromAlgebraic,
    opposite: opposite,
    pieceColor: pieceColor,
    parseFen: parseFen,
    toFen: toFen,
    cloneState: cloneState,
    positionKey: positionKey,
    generateLegalMoves: generateLegalMoves,
    generatePseudoMoves: generatePseudoMoves,
    makeMove: makeMove,
    unmakeMove: unmakeMove,
    isAttacked: isAttacked,
    inCheck: inCheck,
    kingSquare: kingSquare,
    hasLegalMove: hasLegalMove,
    moveToSan: moveToSan,
    parseSan: parseSan,
    uci: uci,
    gameStatus: gameStatus,
    insufficientMaterial: insufficientMaterial,
    perft: perft,
    perftDivide: perftDivide,
    castlingString: castlingString
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  global.ChessEngine = API;
})(typeof window !== 'undefined' ? window : globalThis);
