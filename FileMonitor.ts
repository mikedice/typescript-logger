import readline = require("readline");
import fs = require("fs");
var fileWatcher = require("chokidar");

export class FileMonitor
{
    private curPos:number = 0;

    constructor(public filePath:string){
        if (!fs.existsSync(filePath)){
            console.log(`file does not exist at path ${filePath}`);
            return;
        }

        // save the current length
        this.curPos = fs.statSync(filePath).size;

        // publish the lines in the file at startup
        var inputStream = fs.createReadStream(filePath);
        var readInterface = readline.createInterface(inputStream, null, null, null);
        readInterface.on('line', (val)=>{
            console.log(val);
        });

        var watcher = fileWatcher.watch(filePath);
        watcher.on("change", (path)=>{
            // console.log(`change ${path}`);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.log(`watcher error ${err}`);
                    return;
                }
                if (stats.size > this.curPos){
                    // file has grown so seek to the last position read
                    // and read lines from there
                    var inputStream = fs.createReadStream(filePath, {start: this.curPos-2});
                    var readInterface = readline.createInterface(inputStream, null, null, null);
                    readInterface.on('line', (val)=>{
                        console.log(val);
                    });

                }
                // update current position. Note if the size is smaller than
                // the current position we just come here and the size would get resest
                this.curPos = stats.size;

            });
        });
        // watcher.on("error", (path)=>{console.log(`error ${path}`);});
        // watcher.on("ready", (path)=>{console.log(`ready ${path}`);});
        // watcher.on("raw", (event, path, details)=>{console.log(`raw ${event} ${path} ${details}`);});
    }
}