const assert = require("node:assert/strict");
const { levels, trace, piece, at, sampleRoute, createPulse, advancePulse, polarizationAxis, hasCompletedAllStages } = require("../assets/light-align-engine.js");
const cellMap = pieces => new Map(pieces.map(p => [at(p.x, p.y), p]));
const travel = pieces => advancePulse(createPulse(pieces.find(p => p.type === "laser")), 1000, cellMap(pieces));

for (const [index, level] of levels.entries()) {
  const board = [...level.pieces.map(p => ({ ...p, ...(level.adjustments || []).find(a => a.x === p.x && a.y === p.y) })), ...level.solution];
  assert.equal(new Set(board.map(p => at(p.x,p.y))).size, board.length, "One element per square");
  assert(level.solution.length <= level.limit);
  assert(level.pieces.some(p => p.type === "sample"), "Every puzzle has a sample");
  assert.equal(trace(board).valid, true, "Puzzle solution must pass through the sample");
  assert.equal(trace(level.pieces).valid, false, "Puzzle starts unsolved");
  const pulse = travel(board);
  assert.equal(pulse.end, "detector");
  assert(pulse.samples.size > 0);
}

const straight = [piece(0,7,"laser",{dir:0}), piece(4,7,"detector")];
assert.equal(trace(straight).valid, false, "Detector alone does not satisfy the goal");
assert.equal(travel(straight).samples.size, 0);
assert.equal(trace([...straight, piece(2,7,"sample")]).valid, true);
assert.equal(trace([...straight, piece(2,6,"sample")]).valid, false, "An unvisited sample cannot satisfy the goal");
assert.equal(trace([...straight, piece(6,7,"sample")]).valid, false, "Sample must be before the detector");
assert.equal(trace([...straight, piece(2,7,"sample"), piece(6,6,"sample")]).valid, true, "Passing one sample is sufficient");

for(let dir=0;dir<4;dir++) for(const slash of [true,false]) {
  const incoming = [[1,0],[0,1],[-1,0],[0,-1]][dir];
  const outgoing = (slash ? [[0,-1],[-1,0],[0,1],[1,0]] : [[0,1],[1,0],[0,-1],[-1,0]])[dir];
  const board = [piece(7-2*incoming[0],7-2*incoming[1],"laser",{dir}), piece(7-incoming[0],7-incoming[1],"sample"), piece(7,7,"mirror",{slash}), piece(7+outgoing[0],7+outgoing[1],"detector")];
  assert(trace(board).valid);
  assert.equal(travel(board).end,"detector");
}

for(let dir=0;dir<4;dir++) for(const horizontal of [true,false]) {
  const [dx,dy] = [[1,0],[0,1],[-1,0],[0,-1]][dir];
  const board = [piece(7-3*dx,7-3*dy,"laser",{dir}),piece(7-dx,7-dy,"hwp",{horizontal}),piece(7+dx,7+dy,"sample"),piece(7+2*dx,7+2*dy,"detector")];
  const route = trace(board);
  assert(route.valid);
  assert.equal(sampleRoute(route.points,1.99).polarization,null);
  assert.equal(sampleRoute(route.points,2).polarization,"p");
  const pulse = travel(board);
  assert.equal(pulse.end,"detector");
  assert.equal(pulse.polarization,"p");
}

for(let dir=0;dir<4;dir++) for(const axis of ["h","v"]) {
  const [dx,dy] = [[1,0],[0,1],[-1,0],[0,-1]][dir];
  const board = [piece(7-3*dx,7-3*dy,"laser",{dir}),piece(7-dx,7-dy,"hwp"),piece(7,7,"polarizer",{axis}),piece(7+dx,7+dy,"sample"),piece(7+2*dx,7+2*dy,"detector")];
  const matches = axis === (dir%2===0 ? "v" : "h");
  assert.equal(trace(board).valid,matches);
  const pulse = travel(board);
  assert.equal(pulse.end,matches ? "detector" : "polarizer");
  if(matches) assert.equal(polarizationAxis(pulse.polarization,pulse.dir),axis);
}
for(const first of ["h","v"]) for(const second of ["h","v"]) {
  const board = [piece(1,7,"laser",{dir:0}),piece(2,7,"polarizer",{axis:first}),piece(4,7,"polarizer",{axis:second}),piece(5,7,"sample"),piece(7,7,"detector")];
  assert.equal(trace(board).valid,first===second);
  assert.equal(travel(board).end,first===second ? "detector" : "polarizer");
}
const reflected = [piece(1,10,"laser",{dir:0}),piece(3,10,"polarizer",{axis:"v"}),piece(7,10,"mirror",{slash:true}),piece(7,7,"polarizer",{axis:"h"}),piece(7,5,"sample"),piece(7,3,"detector")];
assert(trace(reflected).valid);
assert.equal(travel(reflected).end,"detector");

const source = piece(1,7,"laser",{dir:0});
const cells = cellMap([source]);
const live = createPulse(source);
advancePulse(live,2.5,cells);
assert.equal(live.x,4);
cells.set(at(5,7),piece(5,7,"mirror",{slash:true}));
advancePulse(live,.25,cells);
assert.equal(live.x,4.25);
assert.equal(live.dir,0);
advancePulse(live,1.25,cells);
assert.equal(live.dir,3);
cells.get(at(5,7)).slash=false;
advancePulse(live,.5,cells);
assert.equal(live.x,5.5);
assert.equal(live.y,7);

const specimen = cellMap([piece(1,7,"laser",{dir:0}),piece(3,7,"sample"),piece(7,7,"detector")]);
const sampled = createPulse(specimen.get(at(1,7)));
advancePulse(sampled,2.5,specimen);
specimen.delete(at(3,7));
advancePulse(sampled,100,specimen);
assert.equal(sampled.end,"detector");
assert(sampled.samples.has(at(3,7)),"Sample history survives edits");
const fresh = createPulse(specimen.get(at(1,7)));
advancePulse(fresh,100,specimen);
assert.equal(fresh.samples.size,0,"New pulses use the current sample placement");

const boundary = createPulse(piece(0,0,"laser",{dir:2}));
advancePulse(boundary,.2,new Map());
assert.equal(boundary.end,null);
advancePulse(boundary,.3,new Map());
assert.equal(boundary.end,"escape");
assert(Math.abs(boundary.x)<1e-9);
assert.equal(travel([piece(0,0,"laser",{dir:0}),piece(1,0,"wall")]).end,"wall");
assert.equal(trace([]).end,"noSource");
assert.equal(levels.length, 5);
assert.equal(levels[2].initialTool, "polarizer");
assert.equal(trace(levels[2].pieces).end, "polarizer", "New middle stage starts geometrically aligned but blocked by polarization");
assert(levels[2].pieces.find(p => p.type === "polarizer").adjustable);
assert.equal(hasCompletedAllStages([4]), false, "Last stage alone must not trigger the celebration");
assert.equal(hasCompletedAllStages([0, 1, 2, 3]), false);
assert.equal(hasCompletedAllStages([0, 1, 2, 3, 4]), true);
assert.equal(hasCompletedAllStages([0, 1, 1, 3, 4]), false);
console.log("Light Align: 5 sample puzzles, polarization challenge, live edits and all-stage completion passed.");
