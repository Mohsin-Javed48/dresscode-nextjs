const myServer = http.createServer((req, res) => {
  res.end("Hello from MyServer");
});

myServer.listen(8000, () => console.log("Server is running"));

const myServer = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") return res.end();
  const now = new Date();
  const formattedDate = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
  const log = `${formattedDate} Request Received from url ${req.url}\n`;

  const myUrl = url.parse(req.url, true);
  console.log(myUrl);

  fs.appendFile("./test.txt", log, (err) => {
    if (err) {
      console.log("ERROR:", err);
    }
  });
  console.log("New Request Received.");

  switch (myUrl.pathname) {
    case "/":
      const qp = myUrl.query.name;
      res.end(`<h1>Hey ${qp}</h1>`);
      break;
    case "/about":
      res.end("<h1>About Us</h1>");
      break;
    default:
      res.end("404");
  }

  // console.log(req.headers);
});
