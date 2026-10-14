import { Coordinate, Wall, Checkpoint, Puzzle, Difficulty } from '../types/game';

// Check if two cells are adjacent (Manhattan distance == 1)
export function isAdjacent(a: Coordinate, b: Coordinate): boolean {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}

// Generate canonical wall key
export function getWallKey(r1: number, c1: number, r2: number, c2: number): string {
  if (r1 < r2 || (r1 === r2 && c1 < c2)) {
    return `${r1},${c1}|${r2},${c2}`;
  }
  return `${r2},${c2}|${r1},${c1}`;
}

// Check if a move between two cells is blocked by a wall
export function isMoveBlockedByWall(a: Coordinate, b: Coordinate, walls: Wall[]): boolean {
  return walls.some(
    w =>
      (w.r1 === a.r && w.c1 === a.c && w.r2 === b.r && w.c2 === b.c) ||
      (w.r2 === a.r && w.c2 === a.c && w.r1 === b.r && w.c1 === b.c)
  );
}

// Create deterministic pseudo-random generator
export function createSeededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Find a Hamiltonian path on a W x H grid using randomized Warnsdorff heuristic
export function generateHamiltonianPath(
  width: number,
  height: number,
  maxAttempts = 150,
  randomFn: () => number = Math.random
): Coordinate[] | null {
  const totalCells = width * height;
  const dirs = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const visited = new Set<string>();
    const path: Coordinate[] = [];

    // Choose starting cell
    const startR = Math.floor(randomFn() * height);
    const startC = Math.floor(randomFn() * width);
    let curr: Coordinate = { r: startR, c: startC };

    visited.add(`${curr.r},${curr.c}`);
    path.push(curr);

    const getUnvisitedNeighbors = (c: Coordinate): Coordinate[] => {
      const res: Coordinate[] = [];
      for (const d of dirs) {
        const nr = c.r + d.dr;
        const nc = c.c + d.dc;
        if (nr >= 0 && nr < height && nc >= 0 && nc < width && !visited.has(`${nr},${nc}`)) {
          res.push({ r: nr, c: nc });
        }
      }
      return res;
    };

    while (path.length < totalCells) {
      const neighbors = getUnvisitedNeighbors(curr);
      if (neighbors.length === 0) {
        break; // dead end
      }

      // Warnsdorff heuristic: pick neighbor with fewest onward unvisited neighbors
      const scored = neighbors.map(nbr => {
        visited.add(`${nbr.r},${nbr.c}`);
        const onwardCount = getUnvisitedNeighbors(nbr).length;
        visited.delete(`${nbr.r},${nbr.c}`);
        return { nbr, score: onwardCount + randomFn() * 0.4 };
      });

      scored.sort((a, b) => a.score - b.score);
      curr = scored[0].nbr;
      visited.add(`${curr.r},${curr.c}`);
      path.push(curr);
    }

    if (path.length === totalCells) {
      return path;
    }
  }

  // Fallback: S-curve
  const fallbackPath: Coordinate[] = [];
  for (let r = 0; r < height; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < width; c++) fallbackPath.push({ r, c });
    } else {
      for (let c = width - 1; c >= 0; c--) fallbackPath.push({ r, c });
    }
  }
  return fallbackPath;
}

// Generate a complete playable puzzle
export function generatePuzzle(
  width = 6,
  height = 6,
  difficulty: Difficulty = 'medium',
  customId?: string,
  customTitle?: { en: string; ar: string },
  seed?: number
): Puzzle {
  const randomFn = seed !== undefined ? createSeededRandom(seed) : Math.random;
  const path = generateHamiltonianPath(width, height, 150, randomFn) || [];
  const totalCells = width * height;

  // Determine number of checkpoints
  let numCheckpoints = 4;
  if (totalCells <= 25) numCheckpoints = 3;
  else if (totalCells <= 36) numCheckpoints = 5;
  else if (totalCells <= 49) numCheckpoints = 6;
  else numCheckpoints = 7;

  if (difficulty === 'warmup') numCheckpoints = Math.max(3, numCheckpoints - 1);
  if (difficulty === 'hard' || difficulty === 'expert') numCheckpoints += 1;

  // Checkpoint 1 is always path[0]
  const checkpoints: Checkpoint[] = [{ r: path[0].r, c: path[0].c, val: 1 }];

  // Intermediate checkpoints
  const stepInterval = Math.floor((totalCells - 1) / (numCheckpoints - 1));
  for (let i = 1; i < numCheckpoints - 1; i++) {
    const rawIndex = i * stepInterval;
    const jitter = Math.floor((randomFn() - 0.5) * (stepInterval * 0.35));
    const finalIndex = Math.max(1, Math.min(totalCells - 2, rawIndex + jitter));
    checkpoints.push({
      r: path[finalIndex].r,
      c: path[finalIndex].c,
      val: i + 1,
    });
  }

  // Final checkpoint at path[totalCells - 1]
  checkpoints.push({
    r: path[totalCells - 1].r,
    c: path[totalCells - 1].c,
    val: numCheckpoints,
  });

  // Walls: adjacent cells that are NOT consecutive in the Hamiltonian path
  const consecutiveEdges = new Set<string>();
  for (let i = 0; i < path.length - 1; i++) {
    consecutiveEdges.add(getWallKey(path[i].r, path[i].c, path[i + 1].r, path[i + 1].c));
  }

  const candidateWalls: Wall[] = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (c + 1 < width) {
        const key = getWallKey(r, c, r, c + 1);
        if (!consecutiveEdges.has(key)) {
          candidateWalls.push({ r1: r, c1: c, r2: r, c2: c + 1 });
        }
      }
      if (r + 1 < height) {
        const key = getWallKey(r, c, r + 1, c);
        if (!consecutiveEdges.has(key)) {
          candidateWalls.push({ r1: r, c1: c, r2: r + 1, c2: c });
        }
      }
    }
  }

  // Shuffle candidate walls with randomFn
  candidateWalls.sort(() => randomFn() - 0.5);
  const wallCount = Math.min(
    candidateWalls.length,
    difficulty === 'warmup' ? 2 : difficulty === 'medium' ? 5 : difficulty === 'hard' ? 8 : 10
  );

  const selectedWalls = candidateWalls.slice(0, wallCount);

  const id = customId || `gen_${width}x${height}_${Date.now()}`;
  const title = customTitle?.en || `Puzzle ${width}x${height}`;
  const titleAr = customTitle?.ar || `لغز ${width}×${height}`;

  return {
    id,
    title,
    titleAr,
    width,
    height,
    difficulty,
    checkpoints,
    walls: selectedWalls,
    solutionPath: path,
  };
}

// Dead-end detector: checks if the player's path has created an unreachable/trapped cell
export function detectDeadEnd(
  width: number,
  height: number,
  path: Coordinate[],
  walls: Wall[],
  checkpoints: Checkpoint[]
): Coordinate | null {
  if (path.length === 0 || path.length >= width * height - 1) return null;

  const currentTip = path[path.length - 1];
  const finalCp = checkpoints.reduce((max, cp) => (cp.val > max.val ? cp : max), checkpoints[0]);
  const visitedSet = new Set<string>();
  path.forEach(c => visitedSet.add(`${c.r},${c.c}`));

  // Fast O(1) wall barrier lookup table
  const wallSet = new Set<string>();
  walls.forEach(w => {
    wallSet.add(getWallKey(w.r1, w.c1, w.r2, w.c2));
  });

  const isBlockedFast = (a: Coordinate, b: Coordinate): boolean => {
    return wallSet.has(getWallKey(a.r, a.c, b.r, b.c));
  };

  const dirs = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const key = `${r},${c}`;
      if (visitedSet.has(key)) continue;

      const cellCoord: Coordinate = { r, c };
      // Count available connecting neighbors
      let availableNeighbors = 0;

      for (const d of dirs) {
        const nr = r + d.dr;
        const nc = c + d.dc;
        if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
          const neighborCoord: Coordinate = { r: nr, c: nc };
          if (!isBlockedFast(cellCoord, neighborCoord)) {
            // Is it unvisited, OR is it the current tip of our path?
            if (!visitedSet.has(`${nr},${nc}`) || (nr === currentTip.r && nc === currentTip.c)) {
              availableNeighbors++;
            }
          }
        }
      }

      // If cell has 0 available connections, it is 100% trapped
      if (availableNeighbors === 0) {
        return cellCoord;
      }

      // If an unvisited cell is NOT the final checkpoint and only has 1 available connection,
      // it cannot be both entered and exited, which guarantees a dead end!
      const isFinalCell = finalCp && finalCp.r === r && finalCp.c === c;
      if (availableNeighbors < 2 && !isFinalCell && path.length < width * height - 2) {
        // Only trigger if cell is not the sole immediate step of the tip
        const isImmediateTipNeighbor = isAdjacent(cellCoord, currentTip) && !isMoveBlockedByWall(cellCoord, currentTip, walls);
        if (!isImmediateTipNeighbor) {
          return cellCoord;
        }
      }
    }
  }

  return null;
}

// Generate the Weekly Mega 9x9 Puzzle
export function getWeeklyMegaPuzzle(): Puzzle {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  const weekSeed = now.getFullYear() * 100 + weekNumber + 777;

  return generatePuzzle(
    9,
    9,
    'expert',
    `mega_weekly_${now.getFullYear()}_w${weekNumber}`,
    {
      en: `Mega Weekly #${weekNumber} (9×9)`,
      ar: `اللغز الأسبوعي العملاق #${weekNumber} (٩×٩)`,
    },
    weekSeed
  );
}

// Generate 3 fast consecutive puzzles for Time Rush Blitz
export function getTimeRushPuzzles(): Puzzle[] {
  const ts = Date.now();
  return [
    generatePuzzle(5, 5, 'warmup', `blitz_1_${ts}`, { en: 'Blitz Stage 1', ar: 'سباق: المرحلة الأولى' }),
    generatePuzzle(5, 5, 'medium', `blitz_2_${ts}`, { en: 'Blitz Stage 2', ar: 'سباق: المرحلة الثانية' }),
    generatePuzzle(6, 6, 'hard', `blitz_3_${ts}`, { en: 'Blitz Final Stage', ar: 'سباق: المرحلة النهائية' }),
  ];
}

// Generate Sudden Death challenge puzzle (0 backtracks)
export function getSuddenDeathPuzzle(): Puzzle {
  const ts = Date.now();
  return generatePuzzle(6, 6, 'hard', `sudden_death_${ts}`, {
    en: 'Sudden Death Challenge',
    ar: 'تحدي الخطوة الواحدة (بدون أخطاء)',
  });
}
