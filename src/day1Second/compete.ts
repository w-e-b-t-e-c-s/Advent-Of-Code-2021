import { reportData } from '../../assets/day1/sonar_report';

const SAMPLE_LENGTH = 3;

function arraySum(offset: number = 0) {
	let sum = 0;
	for (let index = 0 + offset; index < SAMPLE_LENGTH + offset; index++) {
		sum += reportData[index]!;
	}
	return sum;
}

export function runCompete(): void {
	let numberOfIncreases = 0;

	for (let mainLoopIndex = 0; mainLoopIndex < reportData.length - SAMPLE_LENGTH; mainLoopIndex++) {
		if (arraySum(mainLoopIndex + 1) > arraySum(mainLoopIndex)) {
			numberOfIncreases++;
		}
	}
	console.log('Result = ' + numberOfIncreases);
}
