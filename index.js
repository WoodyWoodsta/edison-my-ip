/**
 * Simple application to push Intel Edison Wifi IP address to a gist
 */

var publicIp = require('public-ip');
var github = require('octonode');
var fs = require('fs');
var path = require('path');

var config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json')));

findIp(config.gistId);

/**
 * Recursively retry for a valid IP address
 * @param  {string} gistId The ID of the gist to push to
 */
function findIp(gistId) {
  console.log('[edison-my-ip] - Starting IP fetch...');
  publicIp.v4()
    .then(function(ip) {
      console.log('[edison-my-ip] - IP fetched successfully');
      pushIp(ip, config.gistId);
  })
    .catch(function(err) {
      console.log('[edison-my-ip] - Failed to fetch IP: ', err);

      // Retry
      setTimeout(function(gistId) {
        console.log('[edison-my-ip] - Retrying IP fetch...');

        findIp(gistId);
      }, 10000);
  });
}

/**
 * Push the IP address to the gist with the specified ID
 * @param  {string} ip     The IP address
 * @param  {string} gistId The ID of the gist to push to
 */
function pushIp(ip, gistId) {
  console.log('[edison-my-ip] - Creating client and gist objects...');

  var client = github.client(config.authToken);
  var gist = client.gist();
  console.log('[edison-my-ip] - Client and gist objects created successfully');

  var content = {
    description: '',
    files: {
      'edison-ip.txt': {
        content: ip
      }
    }
  };
  console.log('[edison-my-ip] - Attempting to edit gist...');

  gist.edit(gistId, content, function(err) {
    if (err) {
      console.log('[edison-my-ip] - Edit gist attempt failed');

    } else {
      console.log('[edison-my-ip] - Gist edit successful');
    }
  });
}
