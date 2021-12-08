import { readFileToArray } from '../../utils/read_file';

const MOTHER_FISH_REPRODUCE_DAYS = 6;
const NEW_FISH_REPRODUCE_DAYS = 8;
const NUMBER_OF_DAYS_SIMULATED = 100;
// const INITIAL_CLUSTER_SIZE = 5000000;
// const MAXIMUM_CLUSTER_SIZE = 10000000;
const INITIAL_CLUSTER_SIZE = 500;
const MAXIMUM_CLUSTER_SIZE = 1000;

let clusters: Array<Array<number>> = [];

function computeCluster(cluster: Array<number>): Array<number> {
	let newFishes: Array<number> = [];
	let actualFishes = cluster.map((fish) => {
		if (!fish) {
			fish = MOTHER_FISH_REPRODUCE_DAYS;
			newFishes.push(NEW_FISH_REPRODUCE_DAYS);
		} else {
			fish--;
		}
		return fish;
	});
	actualFishes = actualFishes.concat(newFishes);
	return actualFishes;
}

export function runCompete(): void {
	const initialStateFromFile = readFileToArray('day6/fishesTest.txt');
	let actualFishes = initialStateFromFile[0].split(',').map((fish) => +fish);

	clusters.push(actualFishes);
	let days = 0;
	while (days < NUMBER_OF_DAYS_SIMULATED) {
		days++;
		let newClusters: Array<Array<number>> = [];
		clusters = clusters.map((cluster) => {
			let result = computeCluster(cluster);
			if (result.length >= MAXIMUM_CLUSTER_SIZE) {
				newClusters.push(result.splice(0, INITIAL_CLUSTER_SIZE));
			}
			return result;
		});
		newClusters.map((cluster) => clusters.push(cluster));
		console.log('Day : ' + days + ' Clusters : ' + clusters.length + ' Fishes : ' + clusters[0].length);
		// console.log(`Lantern fishes after ${days} days = ${actualFishes.join(',')}`);
	}

	let numberOfFishes = clusters.reduce((acc, current) => {
		acc += current.length;
		return acc;
	}, 0);
	console.log('Result = ' + numberOfFishes);
}
