import { readFileToArray } from '../../utils/read_file';

type Measure = {
	height: number;
	isLowPoint: boolean;
};

function init2dArray(from: Array<string>, dest: Array<Array<Measure>>): void {
	for (let row = 0; row < from.length; row++) {
		let sourceRow = from[row].split('');
		let destRow: Array<Measure> = [];
		while (sourceRow.length) {
			destRow.push({ height: +sourceRow.shift()!, isLowPoint: false });
		}
		dest.push(destRow);
	}
}

export function runCompete(): void {
	const floorFromFile = readFileToArray('day9/floor.txt');

	let caveFloor: Array<Array<Measure>> = [];
	init2dArray(floorFromFile, caveFloor);

	const floorHeight = caveFloor.length;
	const floorwidth = caveFloor[0].length;

	let sumOfRisks = 0;
	for (let row = 0; row < floorHeight; row++) {
		for (let column = 0; column < floorwidth; column++) {
			let condMinColumn = column === 0 || caveFloor[row][column - 1].height > caveFloor[row][column].height;
			let condMaxColumn =
				column === floorwidth - 1 || caveFloor[row][column + 1].height > caveFloor[row][column].height;
			let condMinRow = row === 0 || caveFloor[row - 1][column].height > caveFloor[row][column].height;
			let condMaxRow =
				row === floorHeight - 1 || caveFloor[row + 1][column].height > caveFloor[row][column].height;
			if (condMinColumn && condMaxColumn && condMinRow && condMaxRow) {
				caveFloor[row][column].isLowPoint = true;
				sumOfRisks += caveFloor[row][column].height + 1;
			}
		}
	}

	console.log('[Day 09 First] Result = ' + sumOfRisks);
}
