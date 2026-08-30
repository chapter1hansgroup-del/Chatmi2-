import React, { useState, useEffect } from 'react';
import { Terminal, Code, Play, X, ShieldAlert, ArrowLeft } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface StealthDisguiseOverlayProps {
  mode: 'code' | 'calculator' | null;
  onExit: () => void;
}

export const StealthDisguiseOverlay: React.FC<StealthDisguiseOverlayProps> = ({
  mode,
  onExit,
}) => {
  // Calculator state
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Code IDE state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '> next-auth --init',
    'Compiled backend schema in 42ms (PID: 9482)',
    'Listening on https://internal.corp-network:8080',
    'Ready for incoming RPC calls...',
  ]);
  const [terminalCmd, setTerminalCmd] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  if (!mode) return null;

  // Calculator Handlers
  const handleCalcDigit = (digit: string) => {
    soundEffects.playClickSound();
    if (waitingForOperand) {
      setCalcDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const handleCalcOp = (op: string) => {
    soundEffects.playClickSound();
    const current = parseFloat(calcDisplay);
    if (prevVal === null) {
      setPrevVal(current);
    } else if (operator) {
      const result = executeCalc(prevVal, current, operator);
      setCalcDisplay(String(result));
      setPrevVal(result);
    }
    setWaitingForOperand(true);
    setOperator(op);
  };

  const handleCalcEqual = () => {
    soundEffects.playClickSound();
    const current = parseFloat(calcDisplay);
    if (prevVal !== null && operator) {
      const result = executeCalc(prevVal, current, operator);
      setCalcDisplay(String(result));
      setPrevVal(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const executeCalc = (a: number, b: number, op: string) => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const handleCalcClear = () => {
    soundEffects.playClickSound();
    setCalcDisplay('0');
    setPrevVal(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // Terminal Handler
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalCmd.trim()) return;
    const cmd = terminalCmd.trim();
    setTerminalLogs((prev) => [
      ...prev,
      `$ ${cmd}`,
      cmd === 'clear'
        ? 'Console buffer cleared'
        : `Executed \`${cmd}\` successfully with exit code 0.`,
    ]);
    setTerminalCmd('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in select-none">
      {/* Discreet Exit Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-mono">
            {mode === 'code' ? 'workspace: src/core/engine.ts — Visual Studio Code' : 'Calculator.app'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">Press Esc to exit disguise</span>
          <button
            onClick={onExit}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Chat</span>
          </button>
        </div>
      </div>

      {mode === 'code' ? (
        /* VS Code IDE Disguise */
        <div className="flex-1 flex flex-col md:flex-row bg-[#1e1e1e] text-slate-300 font-mono text-xs overflow-hidden">
          {/* File Tree sidebar */}
          <div className="w-56 bg-[#252526] border-r border-[#333] p-3 flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              EXPLORER
            </span>
            <div className="flex flex-col gap-1 text-[11px]">
              <span className="text-slate-400">▾ src/</span>
              <span className="text-indigo-400 pl-3">▪ engine.ts</span>
              <span className="text-slate-400 pl-3">▪ database.ts</span>
              <span className="text-slate-400 pl-3">▪ websocket.ts</span>
              <span className="text-slate-400">▸ tests/</span>
              <span className="text-slate-400">package.json</span>
              <span className="text-slate-400">tsconfig.json</span>
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col">
            {/* Editor Tab */}
            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-[#333]">
              <span className="text-indigo-400">TS</span>
              <span className="text-slate-200">engine.ts</span>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#1e1e1e] leading-relaxed flex">
              <div className="text-slate-600 select-none pr-4 text-right">
                {Array(22)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
              </div>
              <div className="text-slate-300">
                <p>
                  <span className="text-purple-400">import</span> &#123;{' '}
                  <span className="text-yellow-300">WebSocketServer</span> &#125;{' '}
                  <span className="text-purple-400">from</span>{' '}
                  <span className="text-emerald-400">'ws'</span>;
                </p>
                <p>
                  <span className="text-purple-400">import</span> &#123;{' '}
                  <span className="text-yellow-300">createCipheriv</span> &#125;{' '}
                  <span className="text-purple-400">from</span>{' '}
                  <span className="text-emerald-400">'crypto'</span>;
                </p>
                <p className="text-slate-500">// Initialize cluster memory routing manager</p>
                <p>
                  <span className="text-blue-400">export class</span>{' '}
                  <span className="text-yellow-300">NetworkKernel</span> &#123;
                </p>
                <p className="pl-4">
                  <span className="text-blue-400">private</span> readonly id:{' '}
                  <span className="text-emerald-400">string</span>;
                </p>
                <p className="pl-4">
                  <span className="text-blue-400">constructor</span>(id:{' '}
                  <span className="text-emerald-400">string</span>) &#123;
                </p>
                <p className="pl-8">
                  <span className="text-red-400">this</span>.id = id;
                </p>
                <p className="pl-4">&#125;</p>
                <p className="pl-4">
                  <span className="text-blue-400">public async</span>{' '}
                  <span className="text-yellow-300">dispatchFrame</span>(packet:{' '}
                  <span className="text-emerald-400">Uint8Array</span>):{' '}
                  <span className="text-blue-400">Promise</span>&lt;
                  <span className="text-emerald-400">boolean</span>&gt; &#123;
                </p>
                <p className="pl-8 text-slate-500">// Low latency zero-copy frame dispatch</p>
                <p className="pl-8">
                  <span className="text-purple-400">return true</span>;
                </p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>
            </div>

            {/* Simulated Terminal */}
            <div className="h-44 bg-[#181818] border-t border-[#333] p-3 flex flex-col">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold mb-2">
                <Terminal className="w-3.5 h-3.5" /> Terminal
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 text-[11px] font-mono text-slate-400">
                {terminalLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1 mt-1">
                <span className="text-emerald-400">$</span>
                <input
                  type="text"
                  value={terminalCmd}
                  onChange={(e) => setTerminalCmd(e.target.value)}
                  placeholder="npm test, git status, clear..."
                  className="flex-1 bg-transparent text-slate-200 focus:outline-none text-xs"
                />
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Calculator Disguise */
        <div className="flex-1 flex items-center justify-center p-4 bg-slate-900">
          <div className="w-80 bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="text-right px-4 py-3 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-500 block h-4">
                {prevVal !== null ? `${prevVal} ${operator || ''}` : ''}
              </span>
              <span className="text-3xl font-mono font-bold text-slate-100 truncate block">
                {calcDisplay}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              <button
                onClick={handleCalcClear}
                className="p-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95"
              >
                AC
              </button>
              <button
                onClick={() => handleCalcOp('÷')}
                className="p-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95"
              >
                ±
              </button>
              <button
                onClick={() => handleCalcOp('%')}
                className="p-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 active:scale-95"
              >
                %
              </button>
              <button
                onClick={() => handleCalcOp('÷')}
                className="p-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 active:scale-95"
              >
                ÷
              </button>

              {['7', '8', '9'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleCalcDigit(d)}
                  className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-bold hover:bg-slate-800 active:scale-95"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => handleCalcOp('×')}
                className="p-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 active:scale-95"
              >
                ×
              </button>

              {['4', '5', '6'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleCalcDigit(d)}
                  className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-bold hover:bg-slate-800 active:scale-95"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => handleCalcOp('-')}
                className="p-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 active:scale-95"
              >
                -
              </button>

              {['1', '2', '3'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleCalcDigit(d)}
                  className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-bold hover:bg-slate-800 active:scale-95"
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => handleCalcOp('+')}
                className="p-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 active:scale-95"
              >
                +
              </button>

              <button
                onClick={() => handleCalcDigit('0')}
                className="col-span-2 p-3.5 rounded-xl bg-slate-900 text-slate-200 font-bold hover:bg-slate-800 active:scale-95"
              >
                0
              </button>
              <button
                onClick={() => handleCalcDigit('.')}
                className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-bold hover:bg-slate-800 active:scale-95"
              >
                .
              </button>
              <button
                onClick={handleCalcEqual}
                className="p-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 active:scale-95"
              >
                =
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
