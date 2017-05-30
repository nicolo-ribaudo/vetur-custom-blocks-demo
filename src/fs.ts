import * as fs from "fs";

export function writeFile(filename: string, data: string) {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(filename, data, err => err ? reject(err) : resolve());
    });
}
