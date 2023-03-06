var pkg = require("../package.json");
var fs = require("fs");

var writeVersion = function () {
    const buildTs = new Date().toISOString();
    const newLine = "\r\n";
    const infoNote = "// THE FILE JOBDURATIONVERSIONINFO.TS IS AUTOMATICALLY GENERATED DURING BUILD PROCESS" + newLine +
                     "// MANUAL CHANGES TO THIS FILE WILL BE OVERWRITTEN !!!" + newLine + newLine;

    const versionInfo = "export const JOB_DURATION_VERSION_INFO = {" + newLine +
                        "VERSION : '" + pkg.version + "'," + newLine +
                        "BUILD_TS: '" + buildTs + "'" + newLine +
                        "};" + newLine + newLine;

    const fileContent = infoNote + versionInfo;
	fs.writeFileSync("./src/JobDurationVersionInfo.ts", fileContent);
};

writeVersion();
