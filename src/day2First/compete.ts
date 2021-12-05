import { movementData } from '../../assets/day2/movements';

export function runCompete(): void {
	let xPosition = 0;
	let depth = 0;

	for (let mainLoopIndex = 0; mainLoopIndex < movementData.length; mainLoopIndex++) {
		let [ move, meters ] = movementData[mainLoopIndex].split(' ');
		switch (move) {
			case 'forward':
				xPosition += +meters;
				break;
			case 'down':
				depth += +meters;
				break;
			case 'up':
				depth -= +meters;
				break;
			default:
				throw new Error('Unknown movement');
		}
	}
	console.log('Result = ' + xPosition * depth);
}
