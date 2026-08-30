import React from 'react';
import { Gamepad2, Trophy, RotateCcw, HelpCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { GameData, User } from '../types';
import { soundEffects } from '../utils/audio';

interface GameCardProps {
  game: GameData;
  currentUser: User | null;
  onMakeMove?: (gameId: string, cellIndex: number) => void;
  onAnswerTrivia?: (gameId: string, optionIndex: number) => void;
  onRematch?: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  currentUser,
  onMakeMove,
  onAnswerTrivia,
  onRematch,
}) => {
  if (game.gameType === 'tictactoe') {
    const board = game.board || Array(9).fill(null);
    const isMyTurn = !game.winner && (game.currentTurn === currentUser?.id || !game.currentTurn);
    const isGameOver = Boolean(game.winner);

    const handleCellClick = (index: number) => {
      if (isGameOver || board[index]) return;
      soundEffects.pop();
      if (onMakeMove) {
        onMakeMove(game.id, index);
      }
    };

    return (
      <div className="w-full max-w-[280px] sm:max-w-[300px] bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-3 shadow-xl my-1">
        {/* Game Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <Gamepad2 className="w-4 h-4" />
            <span>Tic-Tac-Toe Duel</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {game.playerX?.name || 'X'} vs {game.playerO?.name || 'O'}
          </span>
        </div>

        {/* Status bar */}
        <div className="text-center">
          {game.winner === 'draw' ? (
            <span className="text-xs font-bold text-amber-400">🤝 Game ended in a Draw!</span>
          ) : game.winner ? (
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-400 animate-bounce">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{game.winner} Won the match! 🎉</span>
            </div>
          ) : (
            <span className={`text-xs font-medium ${isMyTurn ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`}>
              {isMyTurn ? "Your turn (Tap an empty cell)" : `Waiting for ${game.currentTurn === 'ai' ? 'Pulse AI' : 'opponent'}...`}
            </span>
          )}
        </div>

        {/* 3x3 Board */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
          {board.map((cell, idx) => (
            <button
              key={idx}
              disabled={isGameOver || Boolean(cell)}
              onClick={() => handleCellClick(idx)}
              className={`aspect-square rounded-lg flex items-center justify-center text-xl sm:text-2xl font-black transition-all ${
                !cell && !isGameOver
                  ? 'bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-500/50 border border-slate-800 cursor-pointer'
                  : 'bg-slate-900 border border-slate-800/50'
              } ${
                cell === 'X'
                  ? 'text-cyan-400 text-shadow shadow-cyan-500/20'
                  : cell === 'O'
                  ? 'text-rose-400 text-shadow shadow-rose-500/20'
                  : ''
              }`}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Rematch action when game ends */}
        {isGameOver && onRematch && (
          <button
            onClick={() => onRematch(game.id)}
            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Play Rematch</span>
          </button>
        )}
      </div>
    );
  }

  if (game.gameType === 'trivia') {
    const isAnswered = typeof game.selectedOption === 'number';

    const handleOptionSelect = (index: number) => {
      if (isAnswered) return;
      if (index === game.correctIndex) {
        soundEffects.reaction();
      } else {
        soundEffects.pop();
      }
      if (onAnswerTrivia) {
        onAnswerTrivia(game.id, index);
      }
    };

    return (
      <div className="w-full max-w-[300px] sm:max-w-[320px] bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-3 shadow-xl my-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400">
            <HelpCircle className="w-4 h-4" />
            <span>Daily Brain Trivia</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 font-semibold border border-violet-500/20">
            +50 XP
          </span>
        </div>

        {/* Question */}
        <p className="text-xs font-semibold text-slate-100 leading-relaxed">
          {game.question || 'What is the fastest messaging protocol in modern computer science?'}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-1.5">
          {(game.options || ['WebSockets', 'HTTP/1.0 Polling', 'SMTP Email', 'Floppy Disks']).map(
            (opt, i) => {
              const isSelected = game.selectedOption === i;
              const isCorrect = i === game.correctIndex;

              let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/80 border-rose-500/80 text-rose-300';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-500';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(i)}
                  className={`w-full p-2 rounded-xl text-left text-xs border flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                </button>
              );
            }
          )}
        </div>

        {/* Result Message */}
        {isAnswered && (
          <div className="text-[11px] text-center pt-1">
            {game.selectedOption === game.correctIndex ? (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Correct Answer! Solved by {game.solvedBy || currentUser?.name || 'You'}
              </span>
            ) : (
              <span className="text-rose-400 font-medium">Nice try! Correct answer was highlighted in green.</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};
