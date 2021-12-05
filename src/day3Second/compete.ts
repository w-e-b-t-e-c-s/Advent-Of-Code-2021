import { diagnosticData } from '../../assets/day3/diagnostic';

type MostCommons = {
	zeros: number;
	ones: number;
	mostOnes: boolean;
	zeroLinesArray: Array<number>;
	oneLinesArray: Array<number>;
};

function computeRating(samples: string[], keepMostOnes: boolean): string {
	let bitIndex = 0;
	let parsedInput: MostCommons;
	parsedInput = {} as MostCommons;

	while (samples.length > 1) {
		parsedInput.zeros = 0;
		parsedInput.ones = 0;
		parsedInput.mostOnes = false;
		parsedInput.zeroLinesArray = [];
		parsedInput.oneLinesArray = [];

		for (let mainLoopIndex = 0; mainLoopIndex < samples.length; mainLoopIndex++) {
			let currentSample: string = samples[mainLoopIndex].slice(bitIndex, bitIndex + 1);
			switch (currentSample) {
				case '0':
					parsedInput.zeros++;
					parsedInput.zeroLinesArray.push(mainLoopIndex);
					break;
				case '1':
					parsedInput.ones++;
					parsedInput.oneLinesArray.push(mainLoopIndex);
					break;
				default:
					throw new Error('Binary input expected');
			}
			parsedInput.mostOnes = parsedInput.ones > parsedInput.zeros;
		}
		if (
			(keepMostOnes && parsedInput.ones >= parsedInput.zeros) ||
			(!keepMostOnes && parsedInput.ones < parsedInput.zeros)
		) {
			for (let linesIndex = parsedInput.zeroLinesArray.length - 1; linesIndex >= 0; linesIndex--) {
				samples.splice(parsedInput.zeroLinesArray[linesIndex], 1);
			}
		} else {
			for (let linesIndex = parsedInput.oneLinesArray.length - 1; linesIndex >= 0; linesIndex--) {
				samples.splice(parsedInput.oneLinesArray[linesIndex], 1);
			}
		}
		bitIndex++;
	}
	return samples.pop()!;
}

export function runCompete(): void {
	let oxygenRate: number;
	let scrubberRate: number = 0;
	let diagnosticDataCopy;

	diagnosticDataCopy = Object.assign([], diagnosticData);
	oxygenRate = parseInt(computeRating(diagnosticDataCopy, true), 2);

	diagnosticDataCopy = Object.assign([], diagnosticData);
	scrubberRate = parseInt(computeRating(diagnosticDataCopy, false), 2);

	console.log('Oxygen rate = ' + oxygenRate);
	console.log('CO2 scrubber rate = ' + scrubberRate);
	console.log('Result = ' + oxygenRate * scrubberRate);
}
