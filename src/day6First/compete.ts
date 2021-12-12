import { readFileToArray } from '../../utils/read_file';

const MOTHER_FISH_REPRODUCE_DAYS = 6;
const NEW_FISH_REPRODUCE_DAYS = 8;
const NUMBER_OF_DAYS_SIMULATED = 80;

export function runCompete(): void {
	let newFishes: Array<number> = [];

	const initialStateFromFile = readFileToArray('day6/fishes.txt');
	let actualFishes = initialStateFromFile[0].split(',').map((fish) => +fish);

	let days = 0;
	while (days < NUMBER_OF_DAYS_SIMULATED) {
		days++;
		actualFishes = actualFishes.map((fish) => {
			if (!fish) {
				fish = MOTHER_FISH_REPRODUCE_DAYS;
				newFishes.push(NEW_FISH_REPRODUCE_DAYS);
			} else {
				fish--;
			}
			return fish;
		});
		actualFishes = actualFishes.concat(newFishes);
		newFishes = [];
	}

	let numberOfFishes = actualFishes.length;
	console.log('[Day 06 First] Result = ' + numberOfFishes);
}
