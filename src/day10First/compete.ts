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

function getParseError(expectedBraces: Array<string>, remainingline: Array<string>): string | null {
	if (!remainingline.length) {
		return null;
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

	let syntaxErrorScore = 0;
	chunkLinesFromFile.map((lineOfChunks, index) => {
		// console.log(`Treat line ${index}`);
		const splittedLine = lineOfChunks.split('');
		let closingBrace = getParseError([], splittedLine);
		if (closingBrace !== null) {
			// console.log(`Expected '${closingBrace}' on line ${index}`);
			switch (closingBrace) {
				case ')':
					syntaxErrorScore += 3;
					break;
				case ']':
					syntaxErrorScore += 57;
					break;
				case '}':
					syntaxErrorScore += 1197;
					break;
				case '>':
					syntaxErrorScore += 25137;
					break;
				default:
					throw new Error('Unknown closing brace found');
			}
		}
		// }
	});

	console.log('[Day 10 First] Result = ' + syntaxErrorScore);
}
