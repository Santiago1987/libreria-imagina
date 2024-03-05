import { existsSync, createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { resolve } from "path";
const downloadFile = (async (url, fileName) => {
    const res = await fetch(url);
    if (!existsSync("downloads")) await mkdir("downloads"); //Optional if you already have downloads directory
    const destination = resolve("./downloads", fileName);
    const fileStream = createWriteStream(destination, { flags: 'wx' });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
});

await downloadFile("https://dydsoft.com/imagina/portal/ver_foto.php?id=432", "432.jpg")