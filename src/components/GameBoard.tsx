import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Coordinate, Puzzle, PathTheme, BoardTheme, TokenTheme } from '../types/game';
import { isAdjacent, isMoveBlockedByWall, getWallKey } from '../utils/generator';
import { sound } from '../utils/audio';
import { getThemeStyles } from '../utils/theme';

interface GameBoardProps {
  puzzle: Puzzle;
  path: Coordinate[];
  onPathChange: (newPath: Coordinate[], didBacktrack?: boolean) => void;
  hintCoordinate?: Coordinate | null;
  errorCoordinate?: Coordinate | null;
  ghostCoordinate?: Coordinate | null;
  deadEndCoordinate?: Coordinate | null;
  isPencilMode?: boolean;
  pencilMarks?: Record<string, number | string>;
  onTogglePencilMark?: (coord: Coordinate) => void;
  pathTheme?: PathTheme;
  boardTheme?: BoardTheme;
  tokenTheme?: TokenTheme;
  disabled?: boolean;
}

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  puzzle,
  path,
  onPathChange,
  hintCoordinate,
  errorCoordinate,
  ghostCoordinate,
  deadEndCoordinate,
  isPencilMode = false,
  pencilMarks = {},
  onTogglePencilMark,
  pathTheme = 'amber',
  boardTheme = 'graphite',
  tokenTheme = 'classic',
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lastCellKeyRef = useRef<string | null>(null);
  const lastShakeTimeRef = useRef<number>(0);
  const particleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPointerDown, setIsPointerDown] = useState(false);
  const [shakingCell, setShakingCell] = useState<string | null>(null);
  const [blockedWallKey, setBlockedWallKey] = useState<string | null>(null);
  const [particles, setParticles] = useState<TrailParticle[]>([]);

  const theme = useMemo(() => getThemeStyles(pathTheme, boardTheme, tokenTheme), [pathTheme, boardTheme, tokenTheme]);

  const { width, height, checkpoints, walls } = puzzle;

  // Build lookup maps for fast access
  const checkpointMap = useMemo(() => {
    const map = new Map<string, number>();
    checkpoints.forEach(cp => {
      map.set(`${cp.r},${cp.c}`, cp.val);
    });
    return map;
  }, [checkpoints]);

  const visitedSet = useMemo(() => {
    const set = new Set<string>();
    path.forEach(coord => {
      set.add(`${coord.r},${coord.c}`);
    });
    return set;
  }, [path]);

  // Determine current highest checkpoint reached in sequence
  const currentMaxCheckpoint = useMemo(() => {
    let maxVal = 0;
    for (const coord of path) {
      const val = checkpointMap.get(`${coord.r},${coord.c}`);
      if (val !== undefined && val === maxVal + 1) {
        maxVal = val;
      }
    }
    return maxVal;
  }, [path, checkpointMap]);

  const nextExpectedCheckpoint = currentMaxCheckpoint + 1;

  // Fast O(1) wall barrier lookup table
  const wallSet = useMemo(() => {
    const set = new Set<string>();
    walls.forEach(w => set.add(getWallKey(w.r1, w.c1, w.r2, w.c2)));
    return set;
  }, [walls]);

  const isBlockedFast = useCallback((from: Coordinate, to: Coordinate): boolean => {
    return wallSet.has(getWallKey(from.r, from.c, to.r, to.c));
  }, [wallSet]);

  // Set of valid adjacent coordinates player can step to next
  const validNextMoveSet = useMemo(() => {
    const set = new Set<string>();
    if (path.length === 0) {
      const startCp = checkpoints.find(cp => cp.val === 1);
      if (startCp) set.add(`${startCp.r},${startCp.c}`);
      return set;
    }
    const currentTip = path[path.length - 1];
    const dirs = [
      { r: currentTip.r - 1, c: currentTip.c },
      { r: currentTip.r + 1, c: currentTip.c },
      { r: currentTip.r, c: currentTip.c - 1 },
      { r: currentTip.r, c: currentTip.c + 1 },
    ];
    for (const d of dirs) {
      if (d.r >= 0 && d.r < height && d.c >= 0 && d.c < width) {
        if (!visitedSet.has(`${d.r},${d.c}`)) {
          if (!isBlockedFast(currentTip, d)) {
            const val = checkpointMap.get(`${d.r},${d.c}`);
            if (val === undefined || val === nextExpectedCheckpoint) {
              set.add(`${d.r},${d.c}`);
            }
          }
        }
      }
    }
    return set;
  }, [path, checkpoints, height, width, visitedSet, isBlockedFast, checkpointMap, nextExpectedCheckpoint]);

  // Trigger brief shake on illegal move with strict throttling
  const triggerShake = useCallback((coord: Coordinate) => {
    const now = Date.now();
    if (now - lastShakeTimeRef.current < 320) return;
    lastShakeTimeRef.current = now;

    setShakingCell(`${coord.r},${coord.c}`);
    sound.playInvalid();
    setTimeout(() => setShakingCell(null), 240);
  }, []);

  // Process attempt to move to a cell
  const handleTryMove = useCallback(
    (target: Coordinate, isDirectTap = false) => {
      if (disabled) return;

      if (path.length === 0) {
        // Must start at checkpoint 1
        const startCp = checkpoints.find(cp => cp.val === 1);
        if (startCp && startCp.r === target.r && startCp.c === target.c) {
          sound.playCheckpoint(1);
          onPathChange([target]);
        } else if (isDirectTap) {
          triggerShake(target);
        }
        return;
      }

      const currentTip = path[path.length - 1];

      // If clicked current tip, no-op
      if (currentTip.r === target.r && currentTip.c === target.c) {
        return;
      }

      // 1. Backtracking check:
      // If moving back to previous cell (path.length - 2)
      if (path.length >= 2) {
        const prev = path[path.length - 2];
        if (prev.r === target.r && prev.c === target.c) {
          sound.playUndo();
          onPathChange(path.slice(0, path.length - 1), true);
          return;
        }
      }

      // If user clicked or dragged back onto ANY earlier cell in the path
      const existingIdx = path.findIndex(p => p.r === target.r && p.c === target.c);
      if (existingIdx !== -1) {
        sound.playUndo();
        onPathChange(path.slice(0, existingIdx + 1), true);
        return;
      }

      // 2. Forward step validation:
      const isValidSingleStep = (from: Coordinate, to: Coordinate): boolean => {
        if (!isAdjacent(from, to)) return false;
        if (visitedSet.has(`${to.r},${to.c}`)) return false;
        if (isBlockedFast(from, to)) {
          setBlockedWallKey(getWallKey(from.r, from.c, to.r, to.c));
          setTimeout(() => setBlockedWallKey(null), 350);
          return false;
        }
        const val = checkpointMap.get(`${to.r},${to.c}`);
        if (val !== undefined && val !== nextExpectedCheckpoint) {
          return false;
        }
        return true;
      };

      const spawnParticlesAt = (coord: Coordinate) => {
        const cellSize = 60;
        const cx = (coord.c + 0.5) * cellSize;
        const cy = (coord.r + 0.5) * cellSize;
        const newBatch: TrailParticle[] = Array.from({ length: 3 }).map((_, i) => ({
          id: Date.now() + i,
          x: cx,
          y: cy,
          dx: (Math.random() - 0.5) * 24,
          dy: (Math.random() - 0.5) * 24 - 4,
          color: theme.pathGradientStart,
        }));
        setParticles(newBatch);
        if (particleTimerRef.current) clearTimeout(particleTimerRef.current);
        particleTimerRef.current = setTimeout(() => {
          setParticles([]);
        }, 260);
      };

      // Case A: Directly Adjacent Move (1 step)
      if (isAdjacent(currentTip, target)) {
        if (isValidSingleStep(currentTip, target)) {
          const newPath = [...path, target];
          const val = checkpointMap.get(`${target.r},${target.c}`);
          if (val !== undefined) {
            sound.playCheckpoint(val);
          } else {
            sound.playStep(newPath.length);
          }
          spawnParticlesAt(target);
          onPathChange(newPath);
          return;
        } else {
          // If direct tap or blocked wall, notify user
          if (isDirectTap || isBlockedFast(currentTip, target)) {
            triggerShake(target);
          }
          return;
        }
      }

      // Case B: Diagonal Drag Corner Smoothing (|dr| == 1 && |dc| == 1)
      if (Math.abs(currentTip.r - target.r) === 1 && Math.abs(currentTip.c - target.c) === 1) {
        const corner1: Coordinate = { r: currentTip.r, c: target.c };
        const corner2: Coordinate = { r: target.r, c: currentTip.c };

        // Try corner 1 (horizontal first, then vertical)
        if (isValidSingleStep(currentTip, corner1) && isValidSingleStep(corner1, target)) {
          const newPath = [...path, corner1, target];
          const val = checkpointMap.get(`${target.r},${target.c}`);
          if (val !== undefined) sound.playCheckpoint(val);
          else sound.playStep(newPath.length);
          spawnParticlesAt(target);
          onPathChange(newPath);
          return;
        }

        // Try corner 2 (vertical first, then horizontal)
        if (isValidSingleStep(currentTip, corner2) && isValidSingleStep(corner2, target)) {
          const newPath = [...path, corner2, target];
          const val = checkpointMap.get(`${target.r},${target.c}`);
          if (val !== undefined) sound.playCheckpoint(val);
          else sound.playStep(newPath.length);
          spawnParticlesAt(target);
          onPathChange(newPath);
          return;
        }
      }

      // Any non-adjacent illegal jump is rejected - only shake if player directly tapped it
      if (isDirectTap) {
        triggerShake(target);
      }
    },
    [disabled, path, checkpoints, checkpointMap, nextExpectedCheckpoint, visitedSet, isBlockedFast, onPathChange, triggerShake, theme.pathGradientStart]
  );

  // Step via directional controls (Up, Down, Left, Right)
  const handleStepDirection = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      if (disabled) return;
      if (path.length === 0) {
        const startCp = checkpoints.find(cp => cp.val === 1);
        if (startCp) handleTryMove({ r: startCp.r, c: startCp.c });
        return;
      }
      const tip = path[path.length - 1];
      let target: Coordinate | null = null;

      if (dir === 'up' && tip.r > 0) target = { r: tip.r - 1, c: tip.c };
      else if (dir === 'down' && tip.r < height - 1) target = { r: tip.r + 1, c: tip.c };
      else if (dir === 'left' && tip.c > 0) target = { r: tip.r, c: tip.c - 1 };
      else if (dir === 'right' && tip.c < width - 1) target = { r: tip.r, c: tip.c + 1 };

      if (target) {
        handleTryMove(target);
      }
    },
    [disabled, path, checkpoints, height, width, handleTryMove]
  );

  // Compute grid cell from screen pointer coordinate on gridRef
  const getCellFromPointer = useCallback(
    (clientX: number, clientY: number): Coordinate | null => {
      if (!gridRef.current) return null;
      const rect = gridRef.current.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return null;
      }
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const c = Math.floor((x / rect.width) * width);
      const r = Math.floor((y / rect.height) * height);
      if (r >= 0 && r < height && c >= 0 && c < width) {
        return { r, c };
      }
      return null;
    },
    [width, height]
  );

  // Cell pointer down
  const handleCellPointerDown = (r: number, c: number, e: React.PointerEvent) => {
    if (disabled) return;
    if (isPencilMode) {
      sound.playStep(1);
      onTogglePencilMark?.({ r, c });
      return;
    }
    setIsPointerDown(true);
    lastCellKeyRef.current = `${r},${c}`;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    handleTryMove({ r, c }, true);
  };

  // Cell pointer enter (for mouse dragging)
  const handleCellPointerEnter = (r: number, c: number) => {
    if (isPointerDown && !disabled && !isPencilMode) {
      const cellKey = `${r},${c}`;
      if (lastCellKeyRef.current === cellKey) return;
      lastCellKeyRef.current = cellKey;
      handleTryMove({ r, c }, false);
    }
  };

  // Container pointer move (for touch dragging across grid)
  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown || disabled || isPencilMode) return;
    const cell = getCellFromPointer(e.clientX, e.clientY);
    if (cell) {
      const cellKey = `${cell.r},${cell.c}`;
      if (lastCellKeyRef.current === cellKey) return;
      lastCellKeyRef.current = cellKey;
      handleTryMove(cell, false);
    }
  };

  // Window pointerup to ensure dragging always ends cleanly
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsPointerDown(false);
      lastCellKeyRef.current = null;
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, []);

  // Keyboard navigation support (Arrow keys, WASD, and Z/Backspace for undo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      // Do not capture if typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'backspace'].includes(key)) {
        e.preventDefault();
      }

      if ((key === 'backspace' || key === 'z' || key === 'u') && path.length > 1) {
        sound.playUndo();
        onPathChange(path.slice(0, path.length - 1), true);
        return;
      }

      if (key === 'arrowup' || key === 'w') handleStepDirection('up');
      else if (key === 'arrowdown' || key === 's') handleStepDirection('down');
      else if (key === 'arrowleft' || key === 'a') handleStepDirection('left');
      else if (key === 'arrowright' || key === 'd') handleStepDirection('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, path, handleStepDirection, onPathChange]);

  // Construct SVG points for the drawn path
  const cellSize = 100;
  const svgWidth = width * cellSize;
  const svgHeight = height * cellSize;

  const pathPoints = path.map(p => ({
    x: p.c * cellSize + cellSize / 2,
    y: p.r * cellSize + cellSize / 2,
  }));

  const svgPathD = useMemo(() => {
    if (pathPoints.length === 0) return '';
    return pathPoints.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      return `${acc} L ${pt.x} ${pt.y}`;
    }, '');
  }, [pathPoints]);

  return (
    <div className="w-full max-w-[min(92vw,440px)] sm:max-w-[460px] mx-auto select-none touch-none flex flex-col items-center">
      {/* 2D Board Container with LTR guaranteed alignment */}
      <div
        dir="ltr"
        className="relative flex justify-center items-center w-full select-none touch-none"
      >
        <div
          ref={containerRef}
          onPointerMove={handleContainerPointerMove}
          className={`relative w-full aspect-square max-h-[min(90vw,46dvh)] sm:max-h-[52vh] max-w-[min(90vw,46dvh)] sm:max-w-none ${theme.boardBgClass} rounded-2xl sm:rounded-3xl p-2 sm:p-3.5 shadow-2xl border-2 ${theme.boardBorderClass} touch-none overflow-hidden ring-1 ring-white/10`}
          style={{
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Cell Grid */}
          <div
            ref={gridRef}
            className="grid w-full h-full gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: height }).map((_, r) =>
              Array.from({ length: width }).map((_, c) => {
                const cellKey = `${r},${c}`;
                const isVisited = visitedSet.has(cellKey);
                const val = checkpointMap.get(cellKey);
                const isStart = val === 1;
                const isNextTarget = val === nextExpectedCheckpoint;
                const isHint = hintCoordinate && hintCoordinate.r === r && hintCoordinate.c === c;
                const isError = errorCoordinate && errorCoordinate.r === r && errorCoordinate.c === c;
                const isGhost = ghostCoordinate && ghostCoordinate.r === r && ghostCoordinate.c === c;
                const isDeadEnd = deadEndCoordinate && deadEndCoordinate.r === r && deadEndCoordinate.c === c;
                const isShaking = shakingCell === cellKey;
                const isCurrentTip = path.length > 0 && path[path.length - 1].r === r && path[path.length - 1].c === c;
                const isValidNext = validNextMoveSet.has(cellKey);
                const draftMark = pencilMarks[cellKey];

                return (
                  <div
                    key={cellKey}
                    data-cell="true"
                    data-r={r}
                    data-c={c}
                    onPointerDown={e => handleCellPointerDown(r, c, e)}
                    onPointerEnter={() => handleCellPointerEnter(r, c)}
                    className={`
                      relative rounded-2xl flex items-center justify-center cursor-pointer transition-colors duration-100 touch-none select-none
                      ${isVisited ? theme.cellVisitedClass : theme.cellUnvisitedClass}
                      ${isValidNext ? 'ring-2 ring-amber-400/50 shadow-inner' : ''}
                      ${isShaking ? 'ring-2 ring-rose-500 scale-95' : ''}
                      ${isHint ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-stone-900 animate-pulse' : ''}
                      ${isError ? 'ring-4 ring-rose-500 bg-rose-950/80 animate-pulse' : ''}
                    `}
                  >
                    {/* Draft Pencil Mark */}
                    {draftMark !== undefined && !isVisited && (
                      <span className="absolute top-0.5 right-1 sm:top-1 sm:right-1.5 text-[9px] sm:text-[11px] font-mono font-black text-amber-300 bg-stone-900/90 border border-amber-400/40 rounded px-1 pointer-events-none z-20 shadow-xs">
                        {draftMark}
                      </span>
                    )}

                    {/* Ghost Step Holographic Pulse Indicator */}
                    {isGhost && (
                      <div className="absolute inset-0 rounded-2xl bg-cyan-400/30 border-2 border-cyan-300 ring-4 ring-cyan-400/60 animate-ping pointer-events-none z-30 flex items-center justify-center shadow-lg shadow-cyan-400/50">
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-300 shadow-md" />
                      </div>
                    )}

                    {/* Dead End Alert Warning on trapped cell */}
                    {isDeadEnd && (
                      <div className="absolute inset-0 rounded-2xl bg-rose-500/25 ring-2 ring-rose-500 animate-pulse pointer-events-none z-25 flex items-center justify-center">
                        <span className="text-[10px] text-rose-200 font-bold bg-rose-950/90 px-1 py-0.5 rounded-full border border-rose-500/50 shadow-md">
                          ⚠️
                        </span>
                      </div>
                    )}
                    {/* High-visibility Grid Dot for unvisited cells without number */}
                    {!isVisited && val === undefined && (
                      <span
                        className={`rounded-full pointer-events-none transition-all ${
                          isValidNext
                            ? 'w-3 h-3 bg-amber-400 ring-2 ring-amber-300 shadow-md shadow-amber-400/60 scale-125'
                            : 'w-2 h-2 bg-slate-400/70'
                        }`}
                      />
                    )}

                    {/* Checkpoint Node with high contrast badge and distinct numbers */}
                    {val !== undefined && (
                      <div
                        className={`
                          z-20 flex items-center justify-center font-black transition-transform duration-150 select-none pointer-events-none rounded-full
                          ${width >= 8 ? 'w-6.5 h-6.5 sm:w-8 sm:h-8 text-[11px] sm:text-sm' : width >= 7 ? 'w-7.5 h-7.5 sm:w-9 sm:h-9 text-xs sm:text-base' : 'w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-base'}
                          ${
                            isVisited
                              ? isStart
                                ? theme.tokenStartClass
                                : theme.tokenVisitedClass
                              : isNextTarget
                              ? theme.tokenTargetClass
                              : isStart
                              ? theme.tokenStartClass
                              : theme.tokenClass
                          }
                        `}
                      >
                        <span className="tabular-nums font-black drop-shadow-xs">{val}</span>
                      </div>
                    )}

                    {/* Pulsing indicator at tip of path */}
                    {isCurrentTip && val === undefined && (
                      <div
                        className="z-20 w-4.5 h-4.5 rounded-full ring-4 ring-white animate-pulse pointer-events-none shadow-lg"
                        style={{
                          backgroundColor: theme.pathGradientStart,
                          boxShadow: `0 0 16px ${theme.pathGlowColor}, 0 0 6px white`,
                        }}
                      />
                    )}

                    {/* High-contrast Golden Beacon for hint step */}
                    {isHint && (
                      <div className="absolute inset-0 rounded-2xl bg-amber-400/40 ring-4 ring-amber-300 ring-offset-2 ring-offset-stone-900 animate-pulse pointer-events-none z-30 flex items-center justify-center shadow-2xl shadow-amber-400">
                        <span className="w-4 h-4 rounded-full bg-amber-300 ring-4 ring-white shadow-lg animate-ping" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* SVG Drawing Layer (Smooth Continuous Line) */}
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ pointerEvents: 'none' }}
            className="absolute inset-3 pointer-events-none z-10 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)]"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={theme.pathGradientStart} />
                <stop offset="100%" stopColor={theme.pathGradientEnd} />
              </linearGradient>
            </defs>

            {/* Connected Path Ribbon: Ambient Glow + High-contrast casing + Vivid Core + Specular gloss */}
            {svgPathD && (
              <>
                {/* 1. Hardware-accelerated wide ambient glow underlay (replaces heavy feDropShadow filter) */}
                <path
                  d={svgPathD}
                  fill="none"
                  stroke={theme.pathGlowColor}
                  strokeWidth={cellSize * 0.44}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.35"
                  style={{ pointerEvents: 'none' }}
                />
                {/* 2. Sharp contrast underlay border */}
                <path
                  d={svgPathD}
                  fill="none"
                  stroke="#050a14"
                  strokeWidth={cellSize * 0.36}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                  style={{ pointerEvents: 'none' }}
                />
                {/* 3. Vivid colored core ribbon */}
                <path
                  d={svgPathD}
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth={cellSize * 0.26}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                />
                {/* 4. Specular gloss highlight line */}
                <path
                  d={svgPathD}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={cellSize * 0.07}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.55"
                  style={{ pointerEvents: 'none' }}
                />
              </>
            )}

            {/* Trail Particles FX - Lightweight burst */}
            {particles.map(p => (
              <g key={p.id}>
                <circle
                  cx={p.x + p.dx * 0.5}
                  cy={p.y + p.dy * 0.5}
                  r={cellSize * 0.07}
                  fill={p.color}
                  opacity="0.8"
                />
                <circle
                  cx={p.x + p.dx}
                  cy={p.y + p.dy}
                  r={cellSize * 0.04}
                  fill="#ffffff"
                  opacity="0.9"
                />
              </g>
            ))}

            {/* Wall Barriers: Crisp white casing underlay + vivid neon coral line */}
            {walls.map((w, idx) => {
              const wallKey = getWallKey(w.r1, w.c1, w.r2, w.c2);
              const isBlockedNow = blockedWallKey === wallKey;

              if (w.r1 === w.r2 && Math.abs(w.c1 - w.c2) === 1) {
                const r = w.r1;
                const minC = Math.min(w.c1, w.c2);
                const x = (minC + 1) * cellSize;
                const y1 = r * cellSize + cellSize * 0.12;
                const y2 = (r + 1) * cellSize - cellSize * 0.12;
                return (
                  <g key={`wall-v-${idx}`}>
                    {/* Contrast white casing */}
                    <line
                      x1={x}
                      y1={y1}
                      x2={x}
                      y2={y2}
                      stroke={isBlockedNow ? '#ff2d55' : '#ffffff'}
                      strokeWidth={isBlockedNow ? cellSize * 0.32 : cellSize * 0.22}
                      strokeLinecap="round"
                      style={{ pointerEvents: 'none' }}
                      opacity={isBlockedNow ? 1 : 0.95}
                    />
                    {/* Vivid Neon Red barrier line */}
                    <line
                      x1={x}
                      y1={y1}
                      x2={x}
                      y2={y2}
                      stroke={isBlockedNow ? '#ffef3b' : '#ff2d55'}
                      strokeWidth={isBlockedNow ? cellSize * 0.2 : cellSize * 0.14}
                      strokeLinecap="round"
                      style={{ pointerEvents: 'none' }}
                    />
                  </g>
                );
              }
              if (w.c1 === w.c2 && Math.abs(w.r1 - w.r2) === 1) {
                const c = w.c1;
                const minR = Math.min(w.r1, w.r2);
                const y = (minR + 1) * cellSize;
                const x1 = c * cellSize + cellSize * 0.12;
                const x2 = (c + 1) * cellSize - cellSize * 0.12;
                return (
                  <g key={`wall-h-${idx}`}>
                    {/* Contrast white casing */}
                    <line
                      x1={x1}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke={isBlockedNow ? '#ff2d55' : '#ffffff'}
                      strokeWidth={isBlockedNow ? cellSize * 0.32 : cellSize * 0.22}
                      strokeLinecap="round"
                      style={{ pointerEvents: 'none' }}
                      opacity={isBlockedNow ? 1 : 0.95}
                    />
                    {/* Vivid Neon Red barrier line */}
                    <line
                      x1={x1}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke={isBlockedNow ? '#ffef3b' : '#ff2d55'}
                      strokeWidth={isBlockedNow ? cellSize * 0.2 : cellSize * 0.14}
                      strokeLinecap="round"
                      style={{ pointerEvents: 'none' }}
                    />
                  </g>
                );
              }
              return null;
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
