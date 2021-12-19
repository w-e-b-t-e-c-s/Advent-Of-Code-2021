import { readFileToArray } from '../../utils/read_file';

let transparentPaper: Array<Array<PaperDot>> = [];

type PaperDot = {
	dot: string;
};

type Coordinate = {
	x: number;
	y: number;
};

let paperSize: Coordinate;

function displayMap(): void {
	transparentPaper.map((paperLine: Array<PaperDot>) => {
		console.log(paperLine.reduce((acc: string, current: PaperDot) => acc + current.dot, ''));
	});
}

function initMap(inputList: Array<string>): void {
	inputList.map((commaSeparated) => {
		let [ xCoord, yCoord ] = commaSeparated.split(',');
		transparentPaper[+yCoord][+xCoord].dot = '#';
	});
}

function init2dArray(width: number, heigth: number): void {
	for (let row = 0; row < heigth; row++) {
		let paperRow: Array<PaperDot> = [];
		for (let dotIndex = 0; dotIndex < width; dotIndex++) {
			paperRow.push({ dot: '.' });
		}
		transparentPaper.push(paperRow);
	}
}

function getMaxCoordinate(inputList: Array<string>): { x: number; y: number } {
	return inputList.reduce(
		(accumulator, commaSeparated) => {
			let [ sampleX, sampleY ] = commaSeparated.split(',');
			return {
				x: +sampleX > accumulator.x ? +sampleX : accumulator.x,
				y: +sampleY > accumulator.y ? +sampleY : accumulator.y
			};
		},
		{ x: 0, y: 0 }
	);
}

function foldHorizontal(yFoldPosition: number) {
	for (let yPos = yFoldPosition + 1; yPos <= paperSize.y; yPos++) {
		for (let xPos = 0; xPos <= paperSize.x; xPos++) {
			if (transparentPaper[yPos][xPos].dot === '#') {
				transparentPaper[2 * yFoldPosition - yPos][xPos] = transparentPaper[yPos][xPos];
			}
		}
	}
	for (let lineIndex = paperSize.y; lineIndex >= yFoldPosition; lineIndex--) {
		transparentPaper.splice(lineIndex, 1);
	}
	paperSize.y = yFoldPosition - 1;
}

function foldVertical(xFoldPosition: number) {
	for (let xPos = xFoldPosition + 1; xPos <= paperSize.x; xPos++) {
		for (let yPos = 0; yPos <= paperSize.y; yPos++) {
			if (transparentPaper[yPos][xPos].dot === '#') {
				transparentPaper[yPos][2 * xFoldPosition - xPos] = transparentPaper[yPos][xPos];
			}
		}
	}
	for (let lineIndex = 0; lineIndex <= paperSize.y; lineIndex++) {
		transparentPaper[lineIndex].splice(xFoldPosition, paperSize.x - xFoldPosition + 1);
	}
	paperSize.x = xFoldPosition - 1;
}

export function runCompete(): void {
	const coordinatesFromFile = readFileToArray('day13/coordinates.txt');

	paperSize = getMaxCoordinate(coordinatesFromFile);
	init2dArray(paperSize.x + 1, paperSize.y + 1);
	initMap(coordinatesFromFile);

	foldVertical(655);

	let totalDots = 0;
	transparentPaper.map((paperLine: Array<PaperDot>) => {
		totalDots += paperLine.reduce((acc: number, current: PaperDot) => (current.dot === '#' ? acc + 1 : acc), 0);
	});

	console.log(`[Day 13 First] Result = ${totalDots}`);
}
