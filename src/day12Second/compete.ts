import { readFileToArray } from '../../utils/read_file';

const MAX_PATH_LENGTH = 100;

let pathsFromFile: Array<string>;
let nodeList: Array<PathNode> = [];
let successfulRoutes: Array<string> = [];

type PathNode = {
	name: string;
	isLarge: boolean;
	connections: Array<PathNode>;
};

function isUppercase(value: string): boolean {
	return value === value.toUpperCase();
}

function connectOneWay(startB: PathNode, endB: PathNode): void {
	startB.connections.push(endB);
}

function connectTwoWays(startB: PathNode, endB: PathNode): void {
	startB.connections.push(endB);
	endB.connections.push(startB);
}

function findNode(nodeName: string): PathNode | undefined {
	return nodeList.find((nodeItem) => nodeItem.name === nodeName);
}

function connectPath(path: string): boolean {
	let [ pathBound1, pathBound2 ] = path.split('-');
	let isNewPath: boolean = true;

	let pathBound1Node = findNode(pathBound1);
	if (pathBound1Node) {
		isNewPath = false;
	} else {
		pathBound1Node = {
			name: pathBound1,
			isLarge: isUppercase(pathBound1),
			connections: []
		};
		nodeList.push(pathBound1Node);
	}
	let pathBound2Node = findNode(pathBound2);
	if (pathBound2Node) {
		isNewPath = false;
	} else {
		pathBound2Node = {
			name: pathBound2,
			isLarge: isUppercase(pathBound2),
			connections: []
		};
		nodeList.push(pathBound2Node);
	}
	if (pathBound1Node.name === 'start' || pathBound2Node.name === 'start') {
		let startBound: PathNode;
		let endBound: PathNode;

		if (pathBound1Node.name === 'start') {
			startBound = pathBound1Node;
			endBound = pathBound2Node;
		} else {
			startBound = pathBound2Node;
			endBound = pathBound1Node;
		}
		connectOneWay(startBound, endBound);
	} else if (isNewPath) {
		return false;
	} else if (pathBound1Node.name === 'end' || pathBound2Node.name === 'end') {
		let startBound: PathNode;
		let endBound: PathNode;

		if (pathBound1Node.name === 'end') {
			startBound = pathBound2Node;
			endBound = pathBound1Node;
		} else {
			startBound = pathBound1Node;
			endBound = pathBound2Node;
		}
		connectOneWay(startBound, endBound);
	} else {
		connectTwoWays(pathBound1Node, pathBound2Node);
	}
	return true;
}

function moveNextNode(
	currentNode: PathNode,
	smallCavesVisited: Array<string>,
	fullPath: string,
	pathLength: number,
	hasSmallCaveVisitedTwice: boolean
): void {
	// console.log(`Move to cave ${currentNode.name}`);
	if (!currentNode.isLarge) {
		if (smallCavesVisited.includes(currentNode.name)) {
			if (hasSmallCaveVisitedTwice) {
				// console.log(`Finished path ${fullPath} on visited small cave already twice ${currentNode.name})`);
				return;
			} else {
				hasSmallCaveVisitedTwice = true;
			}
		} else {
			smallCavesVisited.push(currentNode.name);
		}
	}
	if (++pathLength > MAX_PATH_LENGTH) {
		console.log(`Finished path ${fullPath} (max route length on cave ${currentNode.name})`);
		return;
	}
	fullPath += ',' + currentNode.name;
	if (!currentNode.connections.length) {
		if (currentNode.name === 'end') {
			successfulRoutes.push(fullPath);
			// console.log(`Reached end on path ${fullPath}`);
			return;
		}
		// console.log(`Finished path ${fullPath} on small cave`);
		return;
	}
	for (let connectionIndex = 0; connectionIndex < currentNode.connections.length; connectionIndex++) {
		moveNextNode(
			currentNode.connections[connectionIndex],
			[ ...smallCavesVisited ],
			fullPath,
			pathLength,
			hasSmallCaveVisitedTwice
		);
	}
	// console.log(`End of exploration on path ${fullPath}`);
}

function initMap(): void {
	let canConnect: boolean | undefined = undefined;
	while (pathsFromFile.length && canConnect !== false) {
		canConnect = false;
		for (let index = pathsFromFile.length - 1; index >= 0; index--) {
			let path = pathsFromFile[index];
			// console.log(`Trying to link path : '${path}'`);
			if (connectPath(path)) {
				pathsFromFile.splice(index, 1);
				canConnect = true;
				// console.log(`Path '${path}' is connected`);
			} else {
				// console.log(`Path '${path}' is skipped for now`);
			}
		}
	}
	if (pathsFromFile.length && !canConnect) {
		throw new Error(`Remains unlinked path(s) : ${pathsFromFile}`);
	}
}

function displayMap(): void {
	nodeList.map((nodeItem) =>
		console.log(
			`Node name ${nodeItem.name} is linked to ${nodeItem.connections.length
				? nodeItem.connections.map((linkedNode) => linkedNode.name).join(', ')
				: 'nothing'}`
		)
	);
}

export function runCompete(): void {
	pathsFromFile = readFileToArray('day12/paths.txt');

	initMap();
	// displayMap();
	moveNextNode(findNode('start')!, [], 'Init', 0, false);

	console.log(`[Day 12 Second] Result = ${successfulRoutes.length}`);
}
