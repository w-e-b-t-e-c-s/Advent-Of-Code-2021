import { readFileToArray } from '../../utils/read_file';

const MOTHER_FISH_REPRODUCE_DAYS = 6;
const NEW_FISH_REPRODUCE_DAYS = 8;
const NUMBER_OF_DAYS_SIMULATED = 256;

export function runCompete(): void {
	let newFishes: Array<number> = [];
	let ofEachState: Array<number> = Array(9);

	const initialStateFromFile = readFileToArray('day6/fishes.txt');
	let actualFishes = initialStateFromFile[0].split(',').map((fish) => +fish);

	ofEachState.fill(0);
	for (let initIndex = 0; initIndex < actualFishes.length; initIndex++) {
		ofEachState[actualFishes[initIndex]]++;
	}

	let days = 0;
	while (days < NUMBER_OF_DAYS_SIMULATED) {
		days++;
		let spawns = 0;
		for (let stateIndex = 0; stateIndex < 9; stateIndex++) {
			if (!stateIndex) {
				spawns = ofEachState[0];
				ofEachState[0] = 0;
			}
			ofEachState[stateIndex - 1] = ofEachState[stateIndex];
			ofEachState[stateIndex] = 0;
		}
		ofEachState[MOTHER_FISH_REPRODUCE_DAYS] += spawns;
		ofEachState[NEW_FISH_REPRODUCE_DAYS] += spawns;
	}

	console.log(
		`[Day 06 Second] Result after ${NUMBER_OF_DAYS_SIMULATED} days = ${ofEachState.reduce(
			(acc, number) => acc + number,
			0
		)}`
	);
}
