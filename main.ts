import { runCompete as runDay1First } from './src/day1First/compete';
import { runCompete as runDay1Second } from './src/day1Second/compete';
import { runCompete as runDay2First } from './src/day2First/compete';
import { runCompete as runDay2Second } from './src/day2Second/compete';
import { runCompete as runDay3First } from './src/day3First/compete';
import { runCompete as runDay3Second } from './src/day3Second/compete';
import { runCompete as runDay4First } from './src/day4First/compete';
import { runCompete as runDay4Second } from './src/day4Second/compete';
import { runCompete as runDay5First } from './src/day5First/compete';
import { runCompete as runDay5Second } from './src/day5Second/compete';
import { runCompete as runDay6First } from './src/day6First/compete';
import { runCompete as runDay6Second } from './src/day6Second/compete';
import { runCompete as runDay7First } from './src/day7First/compete';
import { runCompete as runDay7Second } from './src/day7Second/compete';
import { runCompete as runDay8First } from './src/day8First/compete';
import { runCompete as runDay8Second } from './src/day8Second/compete';

function main(): void {
	console.log(`run from ${process.cwd()}`);
	runDay1First();
	runDay1Second();
	runDay2First();
	runDay2Second();
	runDay3First();
	runDay3Second();
	runDay4First();
	runDay4Second();
	runDay5First();
	runDay5Second();
	runDay6First();
	runDay6Second();
	runDay7First();
	runDay7Second();
	runDay8First();
	runDay8Second();
}

main();
