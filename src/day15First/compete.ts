import { readFileToArray } from '../../utils/read_file';

const MAX_STEPS_AHEAD = 15;

type Coordinate = {
	x: number;
	y: number;
};

enum MoveDirection {
	'UNDEFINED' = 'UNDEFINED',
	'START' = 'START',
	'DOWN' = 'DOWN',
	'RIGHT' = 'RIGHT',
	'UP' = 'UP',
	'LEFT' = 'LEFT'
}

type ScoreForMove = {
	score: number;
	move: MoveDirection;
	x: number;
	y: number;
};

type FloorPosition = {
	risk: number;
	reached: number;
	x: number;
	y: number;
};

let cavernMaxX = 0;
let cavernMaxY = 0;
let riskLevelsFromFile: Array<string>;
let cavernFloor: Array<Array<FloorPosition>> = [];
let submarinePos: Coordinate = { x: 0, y: 0 };

function init2dArray(): void {
	for (let row = 0; row < cavernMaxY; row++) {
		let riskLevelsRow = riskLevelsFromFile[row]
			.split('')
			.map((riskLevel, index) => ({ risk: +riskLevel, reached: 0, x: index, y: row }));
		cavernFloor.push(riskLevelsRow);
	}
}

function display2dArray(floor: Array<Array<FloorPosition>>): void {
	floor.map((line) => console.log(line.reduce((acc, column) => acc + (column.reached + ''), '')));
	console.log('---');
}

function deepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj)) as T;
}

function getMoveScore(
	direction: MoveDirection,
	currentX: number,
	currentY: number,
	depth: number,
	score: number,
	path: Array<Array<FloorPosition>>,
	bestScore: ScoreForMove
): void {
	// console.log(`Enter isNextMoveX with depth = ${depth}, currentX = ${currentX}, currentY = ${currentY}`);
	if (currentY === cavernMaxY || currentY === -1) {
		// console.log(`Reached line border: currentY = ${currentY}`);
		return;
	}
	if (currentX === cavernMaxX || currentX === -1) {
		// console.log(`Reached column border: currentX = ${currentX}`);
		return;
	}
	const scoreAtThisPos = cavernFloor[currentY][currentX].risk;
	// if (scoreAtThisPos === 9) {
	// 	return;
	// }
	if (path[currentY][currentX].reached) {
		return;
	}
	if (currentY === cavernMaxY - 1 && currentX === cavernMaxX - 1) {
		// console.log(`Reached end`);
		if (score < bestScore.score && bestScore.x + bestScore.y <= currentX + currentY) {
			bestScore.move = direction;
			bestScore.score = score;
			bestScore.x = currentX;
			bestScore.y = currentY;
		}
		return;
	}
	if (depth === 0) {
		// console.log(`Reached search depth 0 with score = ${score}`);
		if (
			// score < bestScore.score
			score < bestScore.score &&
			((submarinePos.x <= currentX && submarinePos.y < currentY) ||
				(submarinePos.x < currentX && submarinePos.y <= currentY)) &&
			bestScore.x + bestScore.y <= currentX + currentY + 1
		) {
			bestScore.move = direction;
			bestScore.score = score;
			bestScore.x = currentX;
			bestScore.y = currentY;
		}
		return;
	}
	score += scoreAtThisPos;
	if (
		score >= bestScore.score ||
		(!(submarinePos.x <= currentX && submarinePos.y < currentY) &&
			!(submarinePos.x < currentX && submarinePos.y <= currentY))
	) {
		return;
	}
	depth--;
	path[currentY][currentX].reached = depth + 1;
	getMoveScore(direction, currentX + 1, currentY, depth, score, deepClone(path), bestScore);
	getMoveScore(direction, currentX, currentY + 1, depth, score, deepClone(path), bestScore);
	getMoveScore(direction, currentX - 1, currentY, depth, score, deepClone(path), bestScore);
	getMoveScore(direction, currentX, currentY - 1, depth, score, deepClone(path), bestScore);
	return;
}

export function runCompete(): void {
	riskLevelsFromFile = readFileToArray('day15/riskLevels.txt');
	cavernMaxX = riskLevelsFromFile[0].length;
	cavernMaxY = riskLevelsFromFile.length;

	console.log(`cavernMaxX = ${cavernMaxX}, cavernMaxY = ${cavernMaxY}`);
	init2dArray();
	// display2dArray(cavernFloor);

	let totalRisk = 0;
	let step = 0;
	submarinePos.x = 0;
	submarinePos.y = 0;
	cavernFloor[submarinePos.y][submarinePos.x].reached = 1;
	while (!(submarinePos.x === cavernMaxX - 1 && submarinePos.y === cavernMaxY - 1)) {
		let bestScore = {
			move: MoveDirection.UNDEFINED,
			score: Number.POSITIVE_INFINITY,
			x: 0,
			y: 0
		};
		getMoveScore(
			MoveDirection.RIGHT,
			submarinePos.x + 1,
			submarinePos.y,
			MAX_STEPS_AHEAD,
			0,
			deepClone(cavernFloor),
			bestScore
		);
		getMoveScore(
			MoveDirection.DOWN,
			submarinePos.x,
			submarinePos.y + 1,
			MAX_STEPS_AHEAD,
			0,
			deepClone(cavernFloor),
			bestScore
		);
		getMoveScore(
			MoveDirection.LEFT,
			submarinePos.x - 1,
			submarinePos.y,
			MAX_STEPS_AHEAD,
			0,
			deepClone(cavernFloor),
			bestScore
		);
		getMoveScore(
			MoveDirection.UP,
			submarinePos.x,
			submarinePos.y - 1,
			MAX_STEPS_AHEAD,
			0,
			deepClone(cavernFloor),
			bestScore
		);
		console.log(
			`Move ${bestScore.move.toString()} to (x: ${bestScore.x}, y: ${bestScore.y}, risk: ${cavernFloor[
				submarinePos.y
			][submarinePos.x].risk}), total ${totalRisk}`
		);
		cavernFloor[submarinePos.y][submarinePos.x].reached = ++step;
		switch (bestScore.move) {
			case MoveDirection.RIGHT:
				submarinePos.x += 1;
				break;
			case MoveDirection.DOWN:
				submarinePos.y += 1;
				break;
			case MoveDirection.LEFT:
				submarinePos.x -= 1;
				break;
			case MoveDirection.UP:
				submarinePos.y -= 1;
				break;
			default:
				throw new Error('Direction to move not specified');
		}
		console.log(`Current pos (x: ${submarinePos.x}, y: ${submarinePos.y})`);
		totalRisk += cavernFloor[submarinePos.y][submarinePos.x].risk;
	}
	console.log(`[Day 15 First] Result = ${totalRisk}`);
}
