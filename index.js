/**
 * Simple application to push Intel Edison Wifi IP address to a gist
 */

var publicIp = require('public-ip');
var github = require('octonode');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json'));

// Fetch the IP address
publicIp.v4().then(function(ip) {
  pushIp(ip, config.gistId);
});

/**
 * Push the IP address to the gist with the specified ID
 * @param  {string} ip     The IP address
 * @param  {string} gistId The ID of the gist to push to
 */
function pushIp(ip, gistId) {
  var client = github.client(config.authToken);
  var gist = client.gist();

  var content = {
    description: '',
    files: {
      'edison-ip.txt': {
        content: ip
      }
    }
  };

  gist.edit(gistId, content, function(err) {
    if (err) {
      fs.writeFileSync('edison-my-ip-log.txt', `The push failed with error:\n${err}`);
    }
  });
}
