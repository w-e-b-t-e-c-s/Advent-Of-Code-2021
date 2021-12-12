import { diagnosticData } from '../../assets/day3/diagnostic';

const REGISTER_BITS_NUMBER = 12;

type MostCommons = {
	zeros: number;
	ones: number;
	mostOnes: boolean;
};

export function runCompete(): void {
	let parsedInput: Array<MostCommons> = new Array(REGISTER_BITS_NUMBER);
	let gammaArray: Array<string> = new Array(REGISTER_BITS_NUMBER);
	let epsylonArray: Array<string> = new Array(REGISTER_BITS_NUMBER);
	let gammaRate: number;
	let epsylonRate: number;

	for (let bitIndex = 0; bitIndex < REGISTER_BITS_NUMBER; bitIndex++) {
		parsedInput[bitIndex] = {} as MostCommons;
		parsedInput[bitIndex].zeros = 0;
		parsedInput[bitIndex].ones = 0;
		parsedInput[bitIndex].mostOnes = false;
	}
	for (let mainLoopIndex = 0; mainLoopIndex < diagnosticData.length; mainLoopIndex++) {
		let currentSample: Array<string> = diagnosticData[mainLoopIndex].split('');
		for (let bitIndex = 0; bitIndex < REGISTER_BITS_NUMBER; bitIndex++) {
			switch (currentSample[bitIndex]) {
				case '0':
					parsedInput[bitIndex].zeros++;
					break;
				case '1':
					parsedInput[bitIndex].ones++;
					break;
				default:
					throw new Error('Binary input expected');
			}
			parsedInput[bitIndex].mostOnes = parsedInput[bitIndex].ones > parsedInput[bitIndex].zeros;

			// console.log(
			// 	`[${bitIndex}].zeros = ${parsedInput[bitIndex].zeros}  ` +
			// 		`[${bitIndex}].ones = ${parsedInput[bitIndex].ones}  ` +
			// 		`[${bitIndex}].mostOnes = ${parsedInput[bitIndex].mostOnes}`
			// );

			gammaArray[bitIndex] = parsedInput[bitIndex].mostOnes ? '1' : '0';
			epsylonArray[bitIndex] = parsedInput[bitIndex].mostOnes ? '0' : '1';
			process.stdout.write('Gamma = ' + gammaArray.join() + ' Epsylon = ' + epsylonArray.join() + '\r');
		}
	}

	gammaRate = parseInt(gammaArray.join(''), 2);
	epsylonRate = parseInt(epsylonArray.join(''), 2);
	console.log();
	console.log('[Day 03 First] Result = ' + gammaRate * epsylonRate);
}
