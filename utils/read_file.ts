import * as fs from 'fs';
import * as path from 'path';

const ROOT_ASSET_PATH = 'assets';

export function readFileToArray(name: string): string[] {
	const fullPath = path.join(process.cwd(), ROOT_ASSET_PATH, name);
	try {
		const data = fs.readFileSync(fullPath);
		const dest = data.toString().replace(/\r\n/g, '\n').split('\n');
		return dest;
	} catch (err) {
		console.log(`Failed reading input file "${fullPath}"`);
		process.exit();
	}
}

export function writeArrayToFile(name: string, data: number[]): void {
	const fullPath = path.join(process.cwd(), ROOT_ASSET_PATH, name);
	try {
		const status = fs.writeFileSync(fullPath, data.join(','));
		return status;
	} catch (err) {
		console.log(`Failed writing to file "${fullPath}"`);
		process.exit();
	}
}
