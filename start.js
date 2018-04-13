
var natUpnp = require('nat-upnp');
 

if (process.argv.length !== 4) {
    console.log("please specify public port number and private port number");
    console.log("node stop.js [public port] [private port]");
    process.exit(1);
}

var publicPort = process.argv[2];
var privatePort = process.argv[3];
var client = natUpnp.createClient();

client.timeout = 10000;

client.portMapping({
  public: publicPort,
  private: privatePort,
  ttl: 3333
}, function(err) {
    if (err) throw err;
    console.log("upnp open %d -> %d", publicPort, privatePort);
    process.exit(0);
});

client.externalIp(function(err, ip) {
    if(err) console.log(err);
    console.log("your server should be available at\n\t"+ip+":"+publicPort);
});