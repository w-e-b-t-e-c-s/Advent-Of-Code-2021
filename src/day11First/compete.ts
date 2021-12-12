import { readFileToArray } from '../../utils/read_file';

const FLASH_MINIMUM_POWER = 9;
const MAX_STEPS = 100;

let octopusField: Array<Array<Location>> = [];
let fieldHeight: number;
let fieldwidth: number;
let sumOfFlashes = 0;

type Location = {
	row: number;
	column: number;
	power: number;
	hasFlashed: boolean;
};

function init2dArray(from: Array<string>, dest: Array<Array<Location>>): void {
	for (let row = 0; row < from.length; row++) {
		let sourceRow = from[row].split('');
		let destRow: Array<Location> = [];
		let column = 0;
		while (sourceRow.length) {
			destRow.push({ row, column: column++, power: +sourceRow.shift()!, hasFlashed: false });
		}
		dest.push(destRow);
	}
}

function testPropagate(neighbour: Location): void {
	if (++neighbour.power > FLASH_MINIMUM_POWER && !neighbour.hasFlashed) {
		sumOfFlashes++;
		neighbour.hasFlashed = true;
		propagateToNeighbours(neighbour);
	}
}

function propagateToNeighbours(currentLocation: Location): void {
	if (currentLocation.column > 0) {
		const leftNeighbour = octopusField[currentLocation.row][currentLocation.column - 1];
		testPropagate(leftNeighbour);
	}
	if (currentLocation.column < fieldwidth - 1) {
		const rightNeighbour = octopusField[currentLocation.row][currentLocation.column + 1];
		testPropagate(rightNeighbour);
	}
	if (currentLocation.row > 0) {
		const upNeighbour = octopusField[currentLocation.row - 1][currentLocation.column];
		testPropagate(upNeighbour);
	}
	if (currentLocation.row < fieldHeight - 1) {
		const downNeighbour = octopusField[currentLocation.row + 1][currentLocation.column];
		testPropagate(downNeighbour);
	}
	if (currentLocation.column > 0 && currentLocation.row > 0) {
		const upLeftNeighbour = octopusField[currentLocation.row - 1][currentLocation.column - 1];
		testPropagate(upLeftNeighbour);
	}
	if (currentLocation.column < fieldwidth - 1 && currentLocation.row > 0) {
		const upRightNeighbour = octopusField[currentLocation.row - 1][currentLocation.column + 1];
		testPropagate(upRightNeighbour);
	}
	if (currentLocation.column > 0 && currentLocation.row < fieldHeight - 1) {
		const downLeftNeighbour = octopusField[currentLocation.row + 1][currentLocation.column - 1];
		testPropagate(downLeftNeighbour);
	}
	if (currentLocation.column < fieldwidth - 1 && currentLocation.row < fieldHeight - 1) {
		const downRightNeighbour = octopusField[currentLocation.row + 1][currentLocation.column + 1];
		testPropagate(downRightNeighbour);
	}
}

function displayField(field: Array<Array<Location>>): void {
	field.map((row) => console.log(row.reduce((acc, current) => acc + current.power.toString() + ' ', ' ')));
}

export function runCompete(): void {
	const octopusFieldFromFile = readFileToArray('day11/octopuses.txt');

	fieldHeight = octopusFieldFromFile.length;
	fieldwidth = octopusFieldFromFile[0].length;
	init2dArray(octopusFieldFromFile, octopusField);

	let step = 0;
	while (++step <= MAX_STEPS) {
		octopusField = octopusField.map((row) => row.map((octopus) => ({ ...octopus, power: ++octopus.power })));

		for (let row = 0; row < fieldHeight; row++) {
			for (let column = 0; column < fieldwidth; column++) {
				let octopus = octopusField[row][column];
				if (octopus.power > FLASH_MINIMUM_POWER && !octopus.hasFlashed) {
					octopus.hasFlashed = true;
					sumOfFlashes++;
					propagateToNeighbours(octopus);
				}
			}
		}
		octopusField = octopusField.map((row) =>
			row.map(
				(octopus) =>
					octopus.power > FLASH_MINIMUM_POWER ? { ...octopus, power: 0, hasFlashed: false } : octopus
			)
		);

		// console.log(`Flashes after step ${step} : ${sumOfFlashes}`);
		// displayField(octopusField);
	}

	console.log('[Day 11 First] Result = ' + sumOfFlashes);
}
