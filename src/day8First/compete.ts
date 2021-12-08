import { readFileToArray } from '../../utils/read_file';

const NUMBER_OF_DIGITS = 10;

export function runCompete(): void {
	const mixedInputOutputFromFile = readFileToArray('day8/display.txt');
	const displayInputs: Array<Array<string>> = [];
	const displayOutputs: Array<Array<string>> = [];
	mixedInputOutputFromFile.map((line, index) => {
		const [ sampleInputPart, sampleOutputPart ] = line.split(' | ');
		displayInputs.push(sampleInputPart.split(' '));
		displayOutputs.push(sampleOutputPart.split(' '));
	});

	let digitsCountArray: Array<number> = Array(NUMBER_OF_DIGITS).fill(0);

	displayOutputs.map((outputEntry) =>
		outputEntry!.map((segments) => {
			switch (segments.length) {
				case 2:
					digitsCountArray[1]++;
					break;
				case 3:
					digitsCountArray[7]++;
					break;
				case 4:
					digitsCountArray[4]++;
					break;
				case 7:
					digitsCountArray[8]++;
					break;
				default:
					break;
			}
		})
	);

	const totalRecognizedDigits = digitsCountArray[1] + digitsCountArray[7] + digitsCountArray[4] + digitsCountArray[8];
	console.log('Result = ' + totalRecognizedDigits);
}
