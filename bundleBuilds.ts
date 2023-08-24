import archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

const buildFolder = path.join(__dirname, 'build');
const bossesDb = path.join(__dirname, 'bosses.db');

const files = fs.readdirSync(buildFolder);

files.forEach(file => {
    const windows = file.includes("win.exe")
    const input = path.join(buildFolder, file)
    const output = fs.createWriteStream(path.join(buildFolder, windows ? `${file}.zip` : `${file}.tar.gz`));
    const archive = archiver(windows ? "zip" : "tar", {
        gzip: true,
    });

    console.log(`Compressing ${file}`)

    output.on('close', () => {
        console.log(`compression factor ${fs.statSync(input).size / archive.pointer()}`);
        console.log(`Compressed ${file}, deleting`)

        fs.rmSync(input)
    });

    archive.on('error', err => {
        throw err;
    });

    archive.pipe(output);

    archive.file(path.join(buildFolder, file), { name: file });
    archive.file(bossesDb, { name: 'bosses.db' });

    archive.finalize();
});