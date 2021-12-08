import { readFileToArray } from '../../utils/read_file';

const NUMBER_OF_DIGITS = 10;

function sortArrayElements(from: Array<string>): Array<string> {
	return from.map((element) => element.split('').sort().join(''));
}

function computeDigitsValue(inputs: Array<string>): Array<string> {
	let result: Array<string> = Array(NUMBER_OF_DIGITS).fill('');
	let digits0And6And9: Array<string> = [];
	let digits0And6: Array<string>;
	let digits2And3And5: Array<string> = [];
	let digits3And5: Array<string> = [];

	inputs.map((digit) => {
		switch (digit.length) {
			case 2:
				result[1] = digit;
				break;
			case 3:
				result[7] = digit;
				break;
			case 4:
				result[4] = digit;
				break;
			case 5:
				digits2And3And5.push(digit);
				break;
			case 6:
				digits0And6And9.push(digit);
				break;
			case 7:
				result[8] = digit;
				break;
			default:
				break;
		}
	});

	let charsOfFour = result[4];
	let haveSegmentsOfFour: Array<string> = [];
	inputs.map((digit) => {
		let allSegmentsFound = true;
		for (const segment of charsOfFour) {
			if (!digit.includes(segment)) {
				allSegmentsFound = false;
			}
		}
		if (allSegmentsFound) {
			haveSegmentsOfFour.push(digit);
		}
	});
	// Now haveSegmentsOfFour contains digits 4, 8, 9
	result[9] = haveSegmentsOfFour.find((digit) => {
		return digit !== result[4] && digit != result[8];
	})!;

	let charOfBottomLeftSegment = result[8];
	for (const segment of result[9]) {
		charOfBottomLeftSegment = charOfBottomLeftSegment.replace(segment, '');
	}

	digits0And6 = digits0And6And9.filter((digit) => digit !== result[9]);

	let charsOfOne = result[1];
	result[6] = digits0And6.find((digit) => {
		let allSegmentsFound = true;
		for (const segment of charsOfOne) {
			if (!digit.includes(segment)) {
				allSegmentsFound = false;
			}
		}
		return !allSegmentsFound;
	})!;

	result[0] = digits0And6.find((digit) => digit !== result[6])!;

	result[2] = digits2And3And5.find((digit) => {
		return digit.includes(charOfBottomLeftSegment);
	})!;

	digits3And5 = digits2And3And5.filter((digit) => digit !== result[2]);

	result[5] = digits3And5.find((digit) => {
		let allSegmentsFound = true;
		for (const segment of charsOfOne) {
			if (!digit.includes(segment)) {
				allSegmentsFound = false;
			}
		}
		return !allSegmentsFound;
	})!;

	result[3] = digits3And5.find((digit) => digit !== result[5])!;

	return result;
}

export function runCompete(): void {
	const mixedInputOutputFromFile = readFileToArray('day8/display.txt');
	const displayInputs: Array<Array<string>> = [];
	const displayOutputs: Array<Array<string>> = [];

	mixedInputOutputFromFile.map((line, index) => {
		const [ sampleInputPart, sampleOutputPart ] = line.split(' | ');
		displayInputs.push(sortArrayElements(sampleInputPart.split(' ')));
		displayOutputs.push(sortArrayElements(sampleOutputPart.split(' ')));
	});

	let result = 0;
	displayOutputs.map((outputEntry, index) => {
		let outputResult: string = '';
		let digitsValue: Array<string> = computeDigitsValue(displayInputs[index]);

		outputEntry.map((segments) => {
			outputResult += digitsValue.findIndex((digit) => digit === segments).toString();
		});
		result += +outputResult;
	});

	console.log('Result = ' + result);
}
