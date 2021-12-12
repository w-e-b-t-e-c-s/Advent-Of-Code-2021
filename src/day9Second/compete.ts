import { readFileToArray } from '../../utils/read_file';

type Location = {
	row: number;
	column: number;
	height: number;
	bassinSize: number | null; // null if not low point
	bassinId: number | null;
};

let caveFloor: Array<Array<Location>> = [];
let floorHeight: number;
let floorWidth: number;

function init2dArray(from: Array<string>, dest: Array<Array<Location>>): void {
	for (let row = 0; row < from.length; row++) {
		let sourceRow = from[row].split('');
		let destRow: Array<Location> = [];
		let column = 0;
		while (sourceRow.length) {
			destRow.push({ height: +sourceRow.shift()!, bassinSize: null, bassinId: null, row, column: column++ });
		}
		dest.push(destRow);
	}
}

function testPropagate(neighbour: Location, minHeight: number, origin: Location) {
	if (neighbour.height < 9 && neighbour.height > minHeight && !neighbour.bassinId) {
		origin.bassinSize!++;
		neighbour.bassinId = origin.bassinId;
		findNeighbours(neighbour, origin);
	}
}

function findNeighbours(currentLocation: Location, lowpointLocation: Location) {
	if (currentLocation.column > 0) {
		const leftNeighbour = caveFloor[currentLocation.row][currentLocation.column - 1];
		testPropagate(leftNeighbour, currentLocation.height, lowpointLocation);
	}
	if (currentLocation.column < floorWidth - 1) {
		const rightNeighbour = caveFloor[currentLocation.row][currentLocation.column + 1];
		testPropagate(rightNeighbour, currentLocation.height, lowpointLocation);
	}
	if (currentLocation.row > 0) {
		const upNeighbour = caveFloor[currentLocation.row - 1][currentLocation.column];
		testPropagate(upNeighbour, currentLocation.height, lowpointLocation);
	}
	if (currentLocation.row < floorHeight - 1) {
		const downNeighbour = caveFloor[currentLocation.row + 1][currentLocation.column];
		testPropagate(downNeighbour, currentLocation.height, lowpointLocation);
	}
}

export function runCompete(): void {
	const floorFromFile = readFileToArray('day9/floor.txt');

	init2dArray(floorFromFile, caveFloor);

	floorHeight = caveFloor.length;
	floorWidth = caveFloor[0].length;

	let listOfBassins: Array<Location> = [];
	let bassinId = 1;
	for (let row = 0; row < floorHeight; row++) {
		for (let column = 0; column < floorWidth; column++) {
			let condMinColumn = column === 0 || caveFloor[row][column - 1].height > caveFloor[row][column].height;
			let condMaxColumn =
				column === floorWidth - 1 || caveFloor[row][column + 1].height > caveFloor[row][column].height;
			let condMinRow = row === 0 || caveFloor[row - 1][column].height > caveFloor[row][column].height;
			let condMaxRow =
				row === floorHeight - 1 || caveFloor[row + 1][column].height > caveFloor[row][column].height;
			if (condMinColumn && condMaxColumn && condMinRow && condMaxRow) {
				caveFloor[row][column].bassinSize = 1;
				caveFloor[row][column].bassinId = bassinId++;
				listOfBassins.push(caveFloor[row][column]);
			}
		}
	}

	caveFloor.map((row) =>
		row.filter((location) => Boolean(location.bassinSize)).map((location) => findNeighbours(location, location))
	);

	caveFloor.map((row) => row.filter((location) => Boolean(location.bassinSize)));
	listOfBassins.sort((a, b) => b.bassinSize! - a.bassinSize!);

	let sumOfThreeBiggest = 1;
	for (let index = 0; index < 3; index++) {
		sumOfThreeBiggest *= listOfBassins[index].bassinSize!;
	}

	console.log('[Day 09 Second] Result = ' + sumOfThreeBiggest);
}
