import util from "util"
import fs from "fs"

const logDirectory = './logs'
const logFilePath = `${logDirectory}/app.log`

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
fs.mkdirSync(logDirectory);
}

// Create a writable stream to the log file
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Create a reference to the original console.log
const originalConsoleLog = console.log;

// Override console.log to write to both console and file
console.log = (...args) => {
const message = args.map((arg) => util.inspect(arg)).join(" "); // Convert arguments to strings
originalConsoleLog(message); // Log to console using original console.log
logStream.write(`${new Date().toISOString()} - ${message}\n`); // Log to file
};

// Now console.log will write to both console and file
console.log("Hello, logging world!");
