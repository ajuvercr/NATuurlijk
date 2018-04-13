
const { spawn } = require('child_process')

function Cleanup(callback) {

    // attach user callback to the process event emitter
    // if no callback, it will still exit gracefully on Ctrl-C
    callback = callback || noOp;
    process.on('cleanup',callback);

    // do app specific cleaning before exiting
    process.on('exit', function () {
        process.emit('cleanup');
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
        console.log('Ctrl-C...');
        process.exit(2);
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function(e) {
        console.log('Uncaught Exception...');
        console.log(e.stack);
        process.exit(99);
    });
};

function spawnChild(name, cmd, args) {
    const ls = spawn(cmd, args);

    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${name}\n ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.log(`stderr: ${name}\n ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`${name} process exited with code ${code}`);
    });
}

function spawn2(cmd) {
    spawn(cmd, {
        stdio: 'inherit',
        shell: true
      });
}

var publicPort = process.argv[2] || 12345;
var privatePort = process.argv[3] || 54321;

Cleanup(() => {
    //spawnChild("stop", "node", ["stop.js", publicPort]);
    spawn2("node stop.js "+publicPort);
});

//spawnChild("server", "http-server", ["-p", privatePort, "-i", "-d", "false", "-s"]);
spawn2("http-server -p "+privatePort+" -i -d false -s");
//spawnChild("start", "node", ["start.js", publicPort, privatePort]);
spawn2("node start.js "+publicPort+ " "+privatePort);
