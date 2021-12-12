// import { windLines } from '../../assets/day5/winds';
import { readFileToArray } from '../../utils/read_file';

const GROUND_SQUARE_UNITS = 1000;

type Measure = {
	strength: number;
};

type Coordinate = {
	x: number;
	y: number;
};

function convertToCoordinate(point: string): Coordinate {
	let [ x, y ] = point.split(',');
	return { x: +x, y: +y };
}

function drawLine(line: string, floor: Array<Array<Measure>>): void {
	let [ startPoint, endPoint ] = line.split(' -> ');
	let startPointXY: Coordinate = convertToCoordinate(startPoint);
	let endPointXY: Coordinate = convertToCoordinate(endPoint);

	if (Math.abs((startPointXY.x - endPointXY.x) / (startPointXY.y - endPointXY.y)) === 1) {
		let projectedLength = Math.abs(endPointXY.y - startPointXY.y);
		if (startPointXY.x <= endPointXY.x) {
			if (startPointXY.y <= endPointXY.y) {
				for (let coordCount = 0; coordCount <= projectedLength; coordCount++) {
					floor[startPointXY.y + coordCount][startPointXY.x + coordCount].strength++;
				}
				return;
			} else {
				for (let coordCount = 0; coordCount <= projectedLength; coordCount++) {
					floor[startPointXY.y - coordCount][startPointXY.x + coordCount].strength++;
				}
				return;
			}
		}
		if (startPointXY.x > endPointXY.x) {
			if (startPointXY.y <= endPointXY.y) {
				for (let coordCount = 0; coordCount <= projectedLength; coordCount++) {
					floor[startPointXY.y + coordCount][startPointXY.x - coordCount].strength++;
				}
				return;
			} else {
				for (let coordCount = 0; coordCount <= projectedLength; coordCount++) {
					floor[startPointXY.y - coordCount][startPointXY.x - coordCount].strength++;
				}
				return;
			}
		}
	}
	if (startPointXY.x === endPointXY.x) {
		if (startPointXY.y <= endPointXY.y) {
			for (let columnCount = startPointXY.y; columnCount <= endPointXY.y; columnCount++) {
				floor[columnCount][startPointXY.x].strength++;
			}
			return;
		} else {
			for (let columnCount = endPointXY.y; columnCount <= startPointXY.y; columnCount++) {
				floor[columnCount][startPointXY.x].strength++;
			}
			return;
		}
	}
	if (startPointXY.y === endPointXY.y) {
		if (startPointXY.x <= endPointXY.x) {
			for (let rowCount = startPointXY.x; rowCount <= endPointXY.x; rowCount++) {
				floor[startPointXY.y][rowCount].strength++;
			}
			return;
		} else {
			for (let rowCount = endPointXY.x; rowCount <= startPointXY.x; rowCount++) {
				floor[startPointXY.y][rowCount].strength++;
			}
			return;
		}
	}
}

function countOverlaps(floor: Array<Array<Measure>>): number {
	let sum: number = 0;
	for (let rows = 0; rows < GROUND_SQUARE_UNITS; rows++) {
		for (let columns = 0; columns < GROUND_SQUARE_UNITS; columns++) {
			if (floor[columns][rows].strength > 1) {
				sum++;
			}
		}
	}
	return sum;
}

function init2dArray(floor: Array<Array<Measure>>): void {
	for (let rows = 0; rows < GROUND_SQUARE_UNITS; rows++) {
		let rowData: Array<Measure> = [];
		for (let columns = 0; columns < GROUND_SQUARE_UNITS; columns++) {
			rowData.push({ strength: 0 } as Measure);
		}
		floor.push(rowData);
	}
}

export function runCompete(): void {
	let oceanFloor: Array<Array<Measure>> = [];

	const windLinesFromFile = readFileToArray('day5/winds.txt');
	let windLinesCopy = Object.assign([], windLinesFromFile);

	init2dArray(oceanFloor);
	while (windLinesCopy.length) {
		let currentLine = windLinesCopy.shift();
		drawLine(currentLine!, oceanFloor);
	}

	let sumOverlaps = countOverlaps(oceanFloor);
	console.log('[Day 05 Second] Result = ' + sumOverlaps);
}
