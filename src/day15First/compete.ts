import { readFileToArray } from '../../utils/read_file';

const MAX_STEPS_AHEAD = 30;

type Coordinate = {
	x: number;
	y: number;
};

enum MoveDirection {
	'DOWN',
	'RIGHT'
}

type ScoreForMove = {
	score: number;
	move: MoveDirection;
};

let cavernMaxX = 0;
let cavernMaxY = 0;
let riskLevelsFromFile: Array<string>;
let cavernFloor: Array<Array<number>> = [];
let submarinePos: Coordinate = { x: 0, y: 0 };

function init2dArray(): void {
	for (let row = 0; row < cavernMaxY; row++) {
		let riskLevelsRow = riskLevelsFromFile[row].split('').map((riskLevel) => +riskLevel);
		cavernFloor.push(riskLevelsRow);
	}
}

function display2dArray(): void {
	cavernFloor.map((line) => console.log(line.reduce((acc, column) => acc + column, '')));
}

function getMoveScore(currentX: number, currentY: number, depth: number, score: number): number {
	// console.log(`Enter isNextMoveX with depth = ${depth}, currentX = ${currentX}, currentY = ${currentY}`);
	if (currentY === cavernMaxY - 1 && currentX === cavernMaxX - 1) {
		// console.log(`Reached end`);
		return score;
	}
	if (depth === 0) {
		// console.log(`Reached search depth 0 with score = ${score}`);
		return score;
	}
	if (currentY === cavernMaxY) {
		// console.log(`Reached last line: currentY = ${currentY}`);
		return Number.POSITIVE_INFINITY;
	}
	if (currentX === cavernMaxX) {
		// console.log(`Reached last column: currentX = ${currentX}`);
		return Number.POSITIVE_INFINITY;
	}
	depth--;
	score += cavernFloor[currentY][currentX];
	let scoreForGoingRight = getMoveScore(currentX + 1, currentY, depth, score);
	// console.log(`scoreForGoingRight = ${scoreForGoingRight}`);
	let scoreForGoingDown = getMoveScore(currentX, currentY + 1, depth, score);
	// console.log(`scoreForGoingDown = ${scoreForGoingDown}`);
	return Math.min(scoreForGoingRight, scoreForGoingDown);
}

export function runCompete(): void {
	riskLevelsFromFile = readFileToArray('day15/riskLevels.txt');
	cavernMaxX = riskLevelsFromFile[0].length;
	cavernMaxY = riskLevelsFromFile.length;

	console.log(`cavernMaxX = ${cavernMaxX}, cavernMaxY = ${cavernMaxY}`);
	init2dArray();
	display2dArray();

	let totalRisk = 0;
	while (!(submarinePos.x === cavernMaxX - 1 && submarinePos.y === cavernMaxY - 1)) {
		let scoreMoveToColRight = getMoveScore(submarinePos.x + 1, submarinePos.y, MAX_STEPS_AHEAD, 0);
		let scoreMoveToLineDown = getMoveScore(submarinePos.x, submarinePos.y + 1, MAX_STEPS_AHEAD, 0);
		let riskNextPos;
		if (scoreMoveToColRight <= scoreMoveToLineDown) {
			riskNextPos = cavernFloor[submarinePos.y][submarinePos.x + 1];
			// console.log(
			// 	`Moved right with risk level ${riskNextPos} (x: ${submarinePos.x}, y: ${submarinePos.y}), total ${totalRisk}`
			// );
			submarinePos.x++;
		} else {
			riskNextPos = cavernFloor[submarinePos.y + 1][submarinePos.x];
			// console.log(
			// 	`Moved down with risk level ${riskNextPos} (x: ${submarinePos.x}, y: ${submarinePos.y}), total ${totalRisk}`
			// );
			submarinePos.y++;
		}
		totalRisk += riskNextPos;
	}
	console.log(`[Day 15 First] Result = ${totalRisk}`);
}
