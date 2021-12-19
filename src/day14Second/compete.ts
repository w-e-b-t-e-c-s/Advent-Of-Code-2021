import { readFileToArray } from '../../utils/read_file';

const MAX_INITIAL_GROWTH_STEPS = 20;
const MAX_DEVELOPMENT_STEPS = 20;

let polymerTemplate = 'KOKHCCHNKKFHBKVVHNPN';

let rulesList: Array<Array<string>> = [];

let startAtom: Atom;
let atomCount: number = polymerTemplate.length;

interface SumForAtom {
	[atom: string]: number;
}

interface SumsToCache {
	[atomCouple: string]: SumForAtom;
}

interface Atom {
	kind: string;
	next: Atom | undefined;
}

let sums: SumForAtom = {};
let sumCache: SumsToCache = {};

function initPolymer(polymer: string): void {
	let toChainAtom: Atom = { kind: polymer.charAt(polymer.length - 1), next: undefined };
	let currentAtom: Atom | undefined = undefined;
	for (let atomIndex = polymer.length - 2; atomIndex >= 0; atomIndex--) {
		currentAtom = { kind: polymer.charAt(atomIndex), next: toChainAtom };
		toChainAtom = currentAtom;
	}
	startAtom = currentAtom!;
}

function addAtomKindToCachedSum(cache: SumForAtom, kind: string): void {
	if (cache[kind]) {
		cache[kind]++;
	} else {
		cache[kind] = 1;
	}
}

function getPairs(polymerTemplate: string): Array<string> {
	let result: Array<string> = [];

	for (let stringIndex = 0; stringIndex < polymerTemplate.length - 1; stringIndex++) {
		const pair = polymerTemplate.slice(stringIndex, stringIndex + 2);
		result.push(pair);
	}
	return result;
}

function applyRuleOnPair(pairToPolymerize: string): string {
	let foundRule: Array<string> | undefined = rulesList.find((rule) => rule[0] === pairToPolymerize);
	let result;
	if (foundRule) {
		result = pairToPolymerize.charAt(0) + foundRule[1] + pairToPolymerize.charAt(1);
	} else {
		result = pairToPolymerize;
	}
	return result;
}

function applyRuleOnAtoms(firstAtom: Atom, secondAtom: Atom): Atom {
	let foundRule: Array<string> | undefined = rulesList.find((rule) => {
		return rule[0].charAt(0) === firstAtom.kind && rule[0].charAt(1) === secondAtom.kind;
	});
	if (foundRule) {
		const newAtom = { kind: foundRule[1], next: secondAtom };
		firstAtom.next = newAtom;
		atomCount++;
	}
	return secondAtom;
}

function processPolymerSample(polymer: string, iterations: number, cache: SumForAtom): void {
	const polymerized = applyRuleOnPair(polymer);

	iterations--;
	// process.stdout.write('iterations : ' + (iterations + '').padStart(2, '0') + '\r');
	// console.log(`Iterations : ${iterations}`);
	if (!iterations) {
		addAtomKindToCachedSum(cache, polymerized.charAt(1));
		addAtomKindToCachedSum(cache, polymerized.charAt(2));
		return;
	}

	const [ leftPart, rightPart ] = getPairs(polymerized);
	processPolymerSample(leftPart, iterations, cache);
	processPolymerSample(rightPart, iterations, cache);
}

export function runCompete(): void {
	const insertionRulesFromFile = readFileToArray('day14/insertionRules.txt');

	insertionRulesFromFile.map((ruleString) => {
		rulesList.push(ruleString.split(' -> '));
	});

	initPolymer(polymerTemplate);

	let stepGrowth = 0;
	while (++stepGrowth < MAX_INITIAL_GROWTH_STEPS + 1) {
		let currentAtom = startAtom;
		while (currentAtom.next) {
			currentAtom = applyRuleOnAtoms(currentAtom, currentAtom.next);
		}
		process.stdout.write(`Step growth : ${stepGrowth}/${MAX_INITIAL_GROWTH_STEPS}` + '\r');
	}

	let stepDevelopment = 0;
	let currentAtom = startAtom;
	sums[startAtom.kind] = 1;
	startAtom = {} as Atom;
	while (currentAtom.next) {
		const sumToCache: SumForAtom = {};
		if (sumCache[`${currentAtom.kind}${currentAtom.next.kind}`]) {
			for (const charProperty in sumCache[`${currentAtom.kind}${currentAtom.next.kind}`]) {
				if (sums[charProperty]) {
					sums[charProperty] += sumCache[`${currentAtom.kind}${currentAtom.next.kind}`][charProperty];
				} else {
					sums[charProperty] = sumCache[`${currentAtom.kind}${currentAtom.next.kind}`][charProperty];
				}
			}
		} else {
			processPolymerSample(`${currentAtom.kind}${currentAtom.next.kind}`, MAX_DEVELOPMENT_STEPS, sumToCache);
			sumCache[`${currentAtom.kind}${currentAtom.next.kind}`] = sumToCache;
			for (const charProperty in sumToCache) {
				if (sums[charProperty]) {
					sums[charProperty] += sumToCache[charProperty];
				} else {
					sums[charProperty] = sumToCache[charProperty];
				}
			}
		}
		stepDevelopment++;
		if (!(stepDevelopment % 1000)) {
			process.stdout.write(`Step development: ${stepDevelopment}/${atomCount}` + '\r');
		}
		currentAtom = currentAtom.next;
	}
	console.log();

	let mostCommonAtom = 0;
	let lessCommonAtom = Number.POSITIVE_INFINITY;
	for (const charProperty in sums) {
		console.log(`Found ${sums[charProperty]} occurrences of ${charProperty}`);
		if (sums[charProperty] > mostCommonAtom) {
			mostCommonAtom = sums[charProperty];
		}
		if (sums[charProperty] < lessCommonAtom) {
			lessCommonAtom = sums[charProperty];
		}
	}

	console.log(`[Day 14 Second] Result = ${mostCommonAtom - lessCommonAtom}`);
}
