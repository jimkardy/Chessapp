/*
 * Gambit — a small opening book.
 * Keyed by position key (piece placement + side + castling + ep).
 * Values are SAN moves; the engine picks randomly among them.
 * Covers the main openings a learner is likely to meet.
 */
(function (global) {
  'use strict';

  var E = global.ChessEngine ||
    (typeof require !== 'undefined' ? require('./engine.js') : null);

  // [moves played as SAN from the start position, reply by the side to move]
  // Stored as lines so they are readable and easy to extend.
  var LINES = [
    // 1.e4
    ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7'],   // Ruy Lopez
    ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4'],   // Italian
    ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6'],               // Scotch
    ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6'],                // Sicilian
    ['e4', 'c5', 'Nc3', 'Nc6', 'g3', 'g6', 'Bg2', 'Bg7'],                  // Closed Sicilian
    ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4'],                                // French
    ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4'],                               // Caro-Kann
    ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5'],                            // Scandinavian
    ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6'],                                // Alekhine
    // 1.d4
    ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7'],                  // QGD
    ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'dxc4'],                 // Slav
    ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],                   // King's Indian
    ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6', 'g3', 'Bb7'],                   // Nimzo/Queen's Indian
    ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'e6'],                                // Dutch
    // Others
    ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6'],                              // English
    ['Nf3', 'd5', 'g3', 'Nf6', 'Bg2', 'g6'],                               // Reti
    ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'd6'],                              // Petroff
    ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5']                                // King's Gambit
  ];

  // Build: position key -> list of replies
  var book = Object.create(null);

  function addLine(line) {
    var state = E.parseFen(E.START_FEN);
    for (var i = 0; i < line.length; i++) {
      var san = line[i];
      var move = E.parseSan(state, san);
      if (!move) return;           // ignore malformed book lines
      if (i % 2 === 0) {
        var key = E.positionKey(state);
        if (!book[key]) book[key] = [];
        if (book[key].indexOf(san) < 0) book[key].push(san);
      }
      E.makeMove(state, move);
    }
  }

  LINES.forEach(addLine);

  function bookMove(state) {
    var key = E.positionKey(state);
    var options = book[key];
    if (!options || !options.length) return null;
    var san = options[Math.floor(Math.random() * options.length)];
    return E.parseSan(state, san);
  }

  var API = { book: book, bookMove: bookMove, LINES: LINES };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  global.GambitOpenings = API;
})(typeof window !== 'undefined' ? window : globalThis);
