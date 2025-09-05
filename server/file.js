const fs = require("fs");
const { add } = require("./math");
const os = require("os");

// write file Sync..
// fs.writeFileSync("./test.txt", "HEllo this is file");

// write file Async..
// fs.writeFile("./test2.txt", "Hello this is sync file");

//  read file Async ..
// const result = fs.readFileSync("./test.txt", "utf8")
// console.log(result);

// read file sync ...
// fs.readFile("./test.txt", "utf-8", (err, data) => {
//   if (err) {
//     console.log("Result");
//   } else {
//     console.log(data);
//   }
// });

// append file Async...
// fs.appendFileSync("./test.txt", "Appended Text");

// append file Sync...
// fs.appendFile("test.txt", "test.txt", (err) => {
//   if (err) {
//     console.error(err);
//   }
// });

// read stats of file Sync...
// console.log(fs.statSync("./test.txt"));

console.log(os.cpus().length);
