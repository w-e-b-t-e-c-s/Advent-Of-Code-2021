import { readFileToArray } from '../../utils/read_file';

function highestValue(positions: Array<number>): number {
	return positions.reduce((acc, curr) => (acc < curr ? curr : acc), 0);
}

function lowestValue(positions: Array<number>): number {
	return positions.reduce((acc, curr) => (acc < curr ? acc : curr), Number.POSITIVE_INFINITY);
}

export function runCompete(): void {
	const crabsPositionsFromFile = readFileToArray('day7/crabs.txt');
	let crabsPositions = crabsPositionsFromFile[0].split(',').map((crab) => +crab);

	let numberOfPositions = highestValue(crabsPositions) + 1;
	let simulatedPositions: Array<number> = Array(numberOfPositions).fill(0);

	for (let position = 0; position < simulatedPositions.length; position++) {
		let fuel = 0;
		for (let crabIndex = 0; crabIndex < crabsPositions.length; crabIndex++) {
			fuel += Math.abs(position - crabsPositions[crabIndex]);
		}
		simulatedPositions[position] = fuel;
	}

	console.log('[Day 07 First] Result = ' + lowestValue(simulatedPositions));
}
