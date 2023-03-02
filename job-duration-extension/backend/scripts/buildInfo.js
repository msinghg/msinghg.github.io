const fs = require('fs');
const gitRev = require('git-rev');
const path = require('path');

function gitRevAsync() {
  return new Promise(ok => gitRev.long(sha => ok(sha)));
}

function saveBuildInfo() {
  return gitRevAsync().then(sha => {

    const appVersion = require('../../appconfig.json').appConfig.version;
    const packageJson = require(path.resolve('./package.json'));

    const buffer = JSON.stringify({
      lastCommit: sha,
      buildTimestamp: new Date(),
      version: appVersion,
      serviceName: packageJson.name
    }, null, 2);

    fs.writeFileSync(`${path.resolve('./')}/src/.build_info.json`, buffer);
  });
};

saveBuildInfo()
  .catch(e => {
    throw e;
    process.exit(1);
  });
