import { movementData } from '../../assets/day2/movements';

export function runCompete(): void {
	let xPosition = 0;
	let depth = 0;
	let aim = 0;

	for (let mainLoopIndex = 0; mainLoopIndex < movementData.length; mainLoopIndex++) {
		let [ move, units ] = movementData[mainLoopIndex].split(' ');
		switch (move) {
			case 'forward':
				xPosition += +units;
				depth += aim * +units;
				break;
			case 'down':
				aim += +units;
				break;
			case 'up':
				aim -= +units;
				break;
			default:
				throw new Error('Unknown movement');
		}
	}
	console.log('[Day 02 Second] Result = ' + xPosition * depth);
}
