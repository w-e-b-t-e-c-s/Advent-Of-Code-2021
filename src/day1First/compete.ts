import { reportData } from '../../assets/day1/sonar_report';

export function runCompete(): void {
	let numberOfIncreases = 0;
	let previous = 0;
	reportData.map((value, index) => {
		if (index && value > previous) {
			numberOfIncreases++;
		}
		previous = value;
	});
	console.log('Result = ' + numberOfIncreases);
}
