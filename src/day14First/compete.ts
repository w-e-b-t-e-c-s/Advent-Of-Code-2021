import { readFileToArray } from '../../utils/read_file';

const MAX_STEPS = 10;
let polymer = 'KOKHCCHNKKFHBKVVHNPN';
// let polymer = 'NNCB';

interface Atom {
	kind: string;
	next: Atom | undefined;
}

let rulesList: Array<Array<string>> = [];
let startAtom: Atom;
let atomCount: number = polymer.length;

interface KeyValue {
	[key: string]: number;
}

let sums: KeyValue = {};

function applyRule(firstAtom: Atom, secondAtom: Atom): Atom {
	let foundRule: Array<string> | undefined = rulesList.find((rule) => {
		return rule[0].charAt(0) === firstAtom.kind && rule[0].charAt(1) === secondAtom.kind;
	});
	if (foundRule) {
		let newAtom = { kind: foundRule[1], next: secondAtom };
		firstAtom.next = newAtom;
		atomCount++;
	}
	return secondAtom;
}

function initPolymer(): void {
	let toChainAtom: Atom = { kind: polymer.charAt(polymer.length - 1), next: undefined };
	let currentAtom: Atom | undefined = undefined;
	for (let atomIndex = polymer.length - 2; atomIndex >= 0; atomIndex--) {
		currentAtom = { kind: polymer.charAt(atomIndex), next: toChainAtom };
		toChainAtom = currentAtom;
	}
	startAtom = currentAtom!;
}

function countAtoms(): void {
	let currentAtom = startAtom;

	while (currentAtom.next) {
		if (sums[currentAtom.kind]) {
			sums[currentAtom.kind]++;
		} else {
			sums[currentAtom.kind] = 1;
		}
		currentAtom = currentAtom.next;
	}
	sums[currentAtom.kind]++;
}

export function runCompete(): void {
	const insertionRulesFromFile = readFileToArray('day14/insertionRules.txt');

	insertionRulesFromFile.map((ruleString) => {
		rulesList.push(ruleString.split(' -> '));
	});

	initPolymer();

	let step = 0;
	while (++step < MAX_STEPS + 1) {
		let currentAtom = startAtom;
		while (currentAtom.next) {
			currentAtom = applyRule(currentAtom, currentAtom.next);
		}
		process.stdout.write('Step : ' + step + ', length = ' + atomCount + '\r');
	}
	// console.log();

	countAtoms();
	// console.log('Sum = %o', sums);

	let mostCommonAtom = 0;
	// let totalSum: number = 0;
	let lessCommonAtom = Number.POSITIVE_INFINITY;
	for (const charProperty in sums) {
		// console.log(`Found ${sums[charProperty]} occurrences of ${charProperty}`);
		// totalSum += sums[charProperty] || 0;
		if (sums[charProperty] > mostCommonAtom) {
			mostCommonAtom = sums[charProperty];
		}
		if (sums[charProperty] < lessCommonAtom) {
			lessCommonAtom = sums[charProperty];
		}
	}

	// console.log(`Total sum = ${totalSum}`);
	console.log(`[Day 14 First] Result = ${mostCommonAtom - lessCommonAtom}`);
}
