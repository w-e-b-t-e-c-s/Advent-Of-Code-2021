import { windLines } from '../../assets/day5/winds';

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
	if (startPointXY.x === endPointXY.x) {
		if (startPointXY.y <= endPointXY.y) {
			for (let rowCount = startPointXY.y; rowCount <= endPointXY.y; rowCount++) {
				floor[startPointXY.x][rowCount].strength++;
			}
			return;
		} else {
			for (let rowCount = endPointXY.y; rowCount <= startPointXY.y; rowCount++) {
				floor[startPointXY.x][rowCount].strength++;
			}
			return;
		}
	}
	if (startPointXY.y === endPointXY.y) {
		if (startPointXY.x <= endPointXY.x) {
			for (let columnCount = startPointXY.x; columnCount <= endPointXY.x; columnCount++) {
				floor[columnCount][startPointXY.y].strength++;
			}
			return;
		} else {
			for (let columnCount = endPointXY.x; columnCount <= startPointXY.x; columnCount++) {
				floor[columnCount][startPointXY.y].strength++;
			}
			return;
		}
	}
}

function countOverlaps(floor: Array<Array<Measure>>): number {
	let sum: number = 0;
	for (let rows = 0; rows < GROUND_SQUARE_UNITS; rows++) {
		for (let columns = 0; columns < GROUND_SQUARE_UNITS; columns++) {
			if (floor[rows][columns].strength > 1) {
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
	let windLinesCopy = Object.assign([], windLines);

	init2dArray(oceanFloor);
	while (windLinesCopy.length) {
		let currentLine = windLinesCopy.shift();
		drawLine(currentLine!, oceanFloor);
	}

	let sumOverlaps = countOverlaps(oceanFloor);
	console.log('Result = ' + sumOverlaps);
}
