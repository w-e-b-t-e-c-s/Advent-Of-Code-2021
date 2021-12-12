import { readFileToArray } from '../../utils/read_file';

const openingBracesList = [ '(', '[', '{', '<' ];

function getExpectedBrace(brace: string): string {
	switch (brace) {
		case '(':
			return ')';
		case '[':
			return ']';
		case '{':
			return '}';
		case '<':
			return '>';
		default:
			throw new Error(`Unknown opening brace found '${brace}'`);
	}
}

function getParseError(expectedBraces: Array<string>, remainingline: Array<string>): string | Array<string> {
	if (!remainingline.length) {
		// console.log(`Incomplete line expecting ${expectedBraces.join('')}`);
		return expectedBraces;
	}
	const nextBrace = remainingline.shift() || '$';
	if (openingBracesList.includes(nextBrace)) {
		// console.log(`Found opening brace ${nextBrace}`);
		expectedBraces.push(getExpectedBrace(nextBrace));
		return getParseError(expectedBraces, remainingline);
	} else {
		if (!expectedBraces.length) {
			// console.log(`Found unexpected ${nextBrace}`);
			return nextBrace;
		}
		const expectedBrace = expectedBraces.pop()!;
		if (nextBrace === expectedBrace) {
			// console.log(`Found expected closing brace ${nextBrace}`);
			return getParseError(expectedBraces, remainingline);
		} else {
			// console.log(`Found error, expected ${expectedBrace} but found ${nextBrace}`);
			return nextBrace;
		}
	}
}

export function runCompete(): void {
	const chunkLinesFromFile = readFileToArray('day10/chunks.txt');

	let listOfCorrectedScores: Array<number> = [];
	chunkLinesFromFile.map((lineOfChunks) => {
		// console.log(`Treat line ${index}`);
		const splittedLine = lineOfChunks.split('');
		// if (corruptedLine(splittedLine)) {
		let closingBrace = getParseError([], splittedLine);
		if (typeof closingBrace !== 'string') {
			let correctionScore = 0;
			while (closingBrace.length) {
				let expectedBrace = closingBrace.pop();
				correctionScore *= 5;
				switch (expectedBrace) {
					case ')':
						correctionScore += 1;
						break;
					case ']':
						correctionScore += 2;
						break;
					case '}':
						correctionScore += 3;
						break;
					case '>':
						correctionScore += 4;
						break;
					default:
						throw new Error('Unknown correction brace found');
				}
				// console.log(`Intermediary score ${correctionScore} after brace ${expectedBrace}`);
			}
			// console.log(`Corrected score ${correctionScore}`);
			listOfCorrectedScores.push(correctionScore);
		}
	});

	listOfCorrectedScores.sort((a, b) => b - a);
	// console.log(`Sorted List of scores : ${listOfCorrectedScores}`);

	console.log('[Day 10 Second] Result = ' + listOfCorrectedScores[Math.floor(listOfCorrectedScores.length / 2)]);
}
