var natUpnp = require('nat-upnp');

if (process.argv.length !== 3) {
    console.log("please specify public port number");
    console.log("node stop.js [public port]");
    process.exit(1);
}
var port = process.argv[2];
var client = natUpnp.createClient();

client.portUnmapping({
    public: port
}, function(err) {
    if(err) throw err;
    console.log("closed upnp port "+port);
    process.exit(0);
});