/* Grid optics shared by the browser and the dependency-free rule checks. */
(function (root) {
  "use strict";
  const SIZE = 15;
  const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const at = (x, y) => y * SIZE + x;
  const piece = (x, y, type, extra = {}) => ({ x, y, type, ...extra });
  // Polarization is stored relative to the ray: s is a dot, p is a line.
  // At the game's fixed 45-degree setting each HWP swaps s and p.
  const polarizationAxis = (polarization, dir) => {
    if (polarization === "s") return dir % 2 === 0 ? "h" : "v";
    if (polarization === "p") return dir % 2 === 0 ? "v" : "h";
    return polarization;
  };
  const togglePolarization = polarization => polarization === "p" ? "s" : "p";
  function polarize(polarization, dir, axis = "h") {
    return polarizationAxis(polarization, dir) === axis ? polarization : "blocked";
  }
  const levels = [
    {
      "title": [
        "A little reflection",
        "첫 번째 반사"
      ],
      "limit": 1,
      "objective": [
        "Pass through the sample, then collect 5 pulses at the detector. Use one mirror.",
        "거울 하나로 샘플을 지난 빛 5개를 검출기에 보내세요."
      ],
      "hint": [
        "Place a / mirror at X12, Y12. The sample is on the way to the detector.",
        "X12, Y12에 / 거울을 놓으면 샘플을 거쳐 검출기로 향해요."
      ],
      "pieces": [
        {
          "x": 2,
          "y": 11,
          "type": "laser",
          "dir": 0
        },
        {
          "x": 11,
          "y": 3,
          "type": "detector"
        },
        {
          "x": 11,
          "y": 7,
          "type": "sample"
        }
      ],
      "solution": [
        {
          "x": 11,
          "y": 11,
          "type": "mirror",
          "slash": true
        }
      ]
    },
    {
      "title": [
        "Take the long way",
        "돌아가는 빛"
      ],
      "limit": 4,
      "objective": [
        "Go around the barrier and through the sample. Collect 5 pulses using up to 4 mirrors.",
        "장벽을 우회하고 샘플을 지난 빛 5개를 모으세요. 거울은 최대 4개!"
      ],
      "hint": [
        "Turn up at X5,Y12, right at X5,Y4, down at X12,Y4 through the sample, then right at X12,Y12.",
        "X5,Y12에서 위로, X5,Y4에서 오른쪽, X12,Y4에서 샘플을 향해 아래로, X12,Y12에서 오른쪽으로 꺾으세요."
      ],
      "pieces": [
        {
          "x": 1,
          "y": 11,
          "type": "laser",
          "dir": 0
        },
        {
          "x": 13,
          "y": 11,
          "type": "detector"
        },
        {
          "x": 7,
          "y": 5,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 6,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 7,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 8,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 9,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 10,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 11,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 12,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 13,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 14,
          "type": "wall"
        },
        {
          "x": 11,
          "y": 7,
          "type": "sample"
        }
      ],
      "solution": [
        {
          "x": 4,
          "y": 11,
          "type": "mirror",
          "slash": true
        },
        {
          "x": 4,
          "y": 3,
          "type": "mirror",
          "slash": true
        },
        {
          "x": 11,
          "y": 3,
          "type": "mirror",
          "slash": false
        },
        {
          "x": 11,
          "y": 11,
          "type": "mirror",
          "slash": false
        }
      ]
    },
    {
      "title": [
        "Aligned, but dark",
        "얼라인은 됐는데…"
      ],
      "objective": [
        "Everything is already aligned. Change the polarizer or add a HWP so light passes through the sample and reaches the detector. Collect 5 pulses.",
        "위치는 모두 맞춰져 있어요. 편광판을 바꾸거나 HWP를 추가해서 샘플을 지난 빛 5개를 검출기에 보내세요."
      ],
      "hint": [
        "Switch the polarizer from H to V, or add another HWP before the H polarizer. Two HWPs turn s → p → s.",
        "편광판을 H에서 V로 바꾸거나, H 편광판 앞에 HWP를 하나 더 넣어보세요. HWP 두 개를 거치면 s → p → s로 바뀝니다."
      ],
      "limit": 0,
      "initialTool": "polarizer",
      "pieces": [
        {
          "x": 2,
          "y": 11,
          "type": "laser",
          "dir": 0
        },
        {
          "x": 4,
          "y": 11,
          "type": "hwp",
          "horizontal": false
        },
        {
          "x": 7,
          "y": 11,
          "type": "sample"
        },
        {
          "x": 9,
          "y": 11,
          "type": "polarizer",
          "axis": "h",
          "adjustable": true
        },
        {
          "x": 11,
          "y": 11,
          "type": "mirror",
          "slash": true
        },
        {
          "x": 11,
          "y": 3,
          "type": "detector"
        }
      ],
      "solution": [],
      "adjustments": [
        {
          "x": 9,
          "y": 11,
          "axis": "v"
        }
      ]
    },
    {
      "title": [
        "Through the sample",
        "샘플까지 안내하기"
      ],
      "limit": 5,
      "objective": [
        "Guide light through the sample before it reaches the detector. Collect 5 pulses with up to 5 mirrors.",
        "샘플을 거쳐 검출기에 도착한 빛 5개를 모으세요. 거울은 최대 5개입니다."
      ],
      "hint": [
        "Try X5,Y12 → X5,Y4 → X12,Y4 → X12,Y12 → X14,Y12. Light passes straight through the sample.",
        "X5,Y12 → X5,Y4 → X12,Y4 → X12,Y12 → X14,Y12 순서로 꺾어보세요. 샘플에서는 직진해요."
      ],
      "pieces": [
        {
          "x": 1,
          "y": 11,
          "type": "laser",
          "dir": 0
        },
        {
          "x": 13,
          "y": 3,
          "type": "detector"
        },
        {
          "x": 11,
          "y": 8,
          "type": "sample"
        },
        {
          "x": 7,
          "y": 11,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 5,
          "type": "wall"
        }
      ],
      "solution": [
        {
          "x": 4,
          "y": 11,
          "type": "mirror",
          "slash": true
        },
        {
          "x": 4,
          "y": 3,
          "type": "mirror",
          "slash": true
        },
        {
          "x": 11,
          "y": 3,
          "type": "mirror",
          "slash": false
        },
        {
          "x": 11,
          "y": 11,
          "type": "mirror",
          "slash": false
        },
        {
          "x": 13,
          "y": 11,
          "type": "mirror",
          "slash": true
        }
      ]
    },
    {
      "title": [
        "The fixed optic",
        "고정된 거울"
      ],
      "limit": 3,
      "objective": [
        "Use the fixed mirror to reach the sample, then the detector. Collect 5 pulses with up to 3 new mirrors.",
        "고정 거울을 활용해 샘플을 지난 빛 5개를 검출기에 보내세요. 거울은 3개 추가할 수 있어요."
      ],
      "hint": [
        "The fixed mirror turns light upward. Turn right at X5,Y4 through the sample, down at X12,Y4, then left at X12,Y12.",
        "고정 거울에서 위로, X5,Y4에서 샘플을 향해 오른쪽, X12,Y4에서 아래, X12,Y12에서 왼쪽으로 꺾으세요."
      ],
      "pieces": [
        {
          "x": 1,
          "y": 11,
          "type": "laser",
          "dir": 0
        },
        {
          "x": 4,
          "y": 11,
          "type": "mirror",
          "slash": true
        },
        {
          "x": 7,
          "y": 3,
          "type": "sample"
        },
        {
          "x": 8,
          "y": 11,
          "type": "detector"
        },
        {
          "x": 6,
          "y": 7,
          "type": "wall"
        },
        {
          "x": 7,
          "y": 7,
          "type": "wall"
        },
        {
          "x": 8,
          "y": 7,
          "type": "wall"
        }
      ],
      "solution": [
        {
          "x": 4,
          "y": 3,
          "type": "mirror",
          "slash": true
        },
        {
          "x": 11,
          "y": 3,
          "type": "mirror",
          "slash": false
        },
        {
          "x": 11,
          "y": 11,
          "type": "mirror",
          "slash": true
        }
      ]
    }
  ];
  function trace(pieces) {
    const cells = new Map(pieces.map(p => [at(p.x, p.y), p]));
    const source = pieces.find(p => p.type === "laser");
    if (!source) return { points: [], end: "noSource", valid: false, samples: [] };
    let { x, y } = source;
    let dir = source.dir;
    let polarization = "s";
    const points = [{ x: x + .5, y: y + .5, dir, polarization }];
    const visited = new Set();
    const samples = new Set();
    const finish = end => ({ points, end, valid: end === "detector" && samples.size > 0, samples: [...samples] });
    while (true) {
      const state = `${x},${y},${dir},${polarization},${samples.size > 0}`;
      if (visited.has(state)) return finish("loop");
      visited.add(state);
      const [dx, dy] = directions[dir];
      x += dx; y += dy;
      if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) {
        points.push({ x: Math.max(0, Math.min(SIZE, x + .5)), y: Math.max(0, Math.min(SIZE, y + .5)), dir, polarization });
        return finish("escape");
      }
      const point = { x: x + .5, y: y + .5, dir, polarization };
      points.push(point);
      const cell = cells.get(at(x, y));
      if (!cell) continue;
      if (cell.type === "mirror") {
        dir = cell.slash ? [3, 2, 1, 0][dir] : [1, 0, 3, 2][dir];
      }
      // Each plate toggles polarization, including for an already p-polarized ray.
      else if (cell.type === "hwp") polarization = togglePolarization(polarization);
      else if (cell.type === "polarizer") {
        const transmitted = polarize(polarization, dir, cell.axis);
        if (transmitted === "blocked") return finish("polarizer");
        polarization = transmitted;
      }
      else if (cell.type === "sample") samples.add(at(x, y));
      else return finish(cell.type);
      point.dir = dir;
      point.polarization = polarization;
    }
  }
  function sampleRoute(points, distance) {
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      if (distance < length) return {
        ...a,
        x: a.x + (b.x - a.x) * distance / length,
        y: a.y + (b.y - a.y) * distance / length
      };
      distance -= length;
    }
    return points[points.length - 1];
  }
  function createPulse(source) {
    return {
      x: source.x + .5, y: source.y + .5,
      cellX: source.x, cellY: source.y, dir: source.dir,
      polarization: "s", samples: new Set(), remaining: null, end: null
    };
  }
  // Pulses carry their own position and history. Editing the table only changes
  // the elements they encounter from this point forward.
  function advancePulse(pulse, distance, cells) {
    while (distance > 1e-9 && !pulse.end) {
      const [dx, dy] = directions[pulse.dir];
      const nx = pulse.cellX + dx, ny = pulse.cellY + dy;
      const outside = nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE;
      if (pulse.remaining === null) pulse.remaining = outside ? .5 : 1;
      const step = Math.min(distance, pulse.remaining);
      pulse.x += dx * step;
      pulse.y += dy * step;
      pulse.remaining -= step;
      distance -= step;
      if (pulse.remaining > 1e-9) continue;
      if (outside) { pulse.end = "escape"; break; }
      pulse.cellX = nx; pulse.cellY = ny;
      // Snap to the exact cell center to avoid accumulated floating-point drift.
      pulse.x = nx + .5; pulse.y = ny + .5;
      pulse.remaining = null;
      const cell = cells.get(at(nx, ny));
      if (!cell) continue;
      if (cell.type === "mirror") {
        pulse.dir = cell.slash ? [3, 2, 1, 0][pulse.dir] : [1, 0, 3, 2][pulse.dir];
      }
      else if (cell.type === "hwp") pulse.polarization = togglePolarization(pulse.polarization);
      else if (cell.type === "polarizer") {
        const transmitted = polarize(pulse.polarization, pulse.dir, cell.axis);
        if (transmitted === "blocked") pulse.end = "polarizer";
        else pulse.polarization = transmitted;
      }
      else if (cell.type === "sample") pulse.samples.add(at(nx, ny));
      else pulse.end = cell.type;
    }
    return pulse;
  }
  const hasCompletedAllStages = completed => levels.every((_, index) => completed.includes(index));
  const api = { hasCompletedAllStages, SIZE, at, piece, levels, trace, sampleRoute, createPulse, advancePulse, polarizationAxis };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.LightAlignEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
