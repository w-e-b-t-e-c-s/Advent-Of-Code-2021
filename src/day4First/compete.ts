import { randomNumbers } from '../../assets/day4/boards';
import { candidateBoards } from '../../assets/day4/boards';

const BOARD_SQUARE_UNITS = 5;

type Tile = {
	value: number;
	state: boolean;
};

function isWinnerBoard(board: Array<Tile>, move: number): boolean {
	board.map((tile) => {
		if (tile.value === move) {
			tile.state = true;
		}
	});
	for (let rowCount = 0; rowCount < BOARD_SQUARE_UNITS; rowCount++) {
		let rowState = true;
		for (let columnCount = 0; columnCount < BOARD_SQUARE_UNITS; columnCount++) {
			if (!board[rowCount * BOARD_SQUARE_UNITS + columnCount].state) {
				rowState = false;
				break;
			}
		}
		if (rowState) {
			return true;
		}
	}
	for (let columnCount = 0; columnCount < BOARD_SQUARE_UNITS; columnCount++) {
		let columnState = true;
		for (let rowCount = 0; rowCount < BOARD_SQUARE_UNITS; rowCount++) {
			if (!board[rowCount * BOARD_SQUARE_UNITS + columnCount].state) {
				columnState = false;
				break;
			}
		}
		if (columnState) {
			return true;
		}
	}
	return false;
}

function sumUpUnmarkedCells(board: Array<Tile>): number {
	let sum = 0;
	board.map((cell) => {
		if (!cell.state) {
			sum += cell.value;
		}
	});
	return sum;
}

export function runCompete(): void {
	let inputTurns = randomNumbers.split(',');
	let allBoards: Array<Array<Tile>>;
	let winnerBoard: Array<Tile> | undefined = undefined;
	let sumOfUnmarked: number = 0;
	let currentMove = 0;

	allBoards = candidateBoards.map((board: string) =>
		board.split(' ').filter(Boolean).map((tileValue: string) => ({ value: parseInt(tileValue), state: false }))
	);
	while (inputTurns.length > 1 && !winnerBoard) {
		currentMove = +inputTurns.shift()!;
		winnerBoard = allBoards.find((board) => isWinnerBoard(board, currentMove));
	}

	if (winnerBoard) {
		sumOfUnmarked = sumUpUnmarkedCells(winnerBoard);
	} else {
		throw Error('No winner board found');
	}
	console.log('[Day 04 First] Result = ' + sumOfUnmarked * currentMove);
}
