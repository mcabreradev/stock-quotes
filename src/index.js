// init project
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();

var cheerio = require("cheerio");
var rp = require("request-promise");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// set path for static assets
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/quotes", async (req, res) => {
  const url = "http://www.eoddata.com/";
  let quotes = [];

  try {
    const data = await rp(url);
    const $ = cheerio.load(data);
    const carrousel = $("#ctl00_cph1_ql1_divQuotes");
    carrousel.find("tr").each(function(i, elem) {
      if (i === 0) return;
      let row = $(elem).find("td");
      let color = $(elem)
        .attr("style")
        .split(":");
      let direction = row
      .eq(4)
      .find("img")
      .attr("src");

      quotes.push({
        code: row.eq(0).text(),
        name: row.eq(1).text(),
        last: row.eq(2).text(),
        change: row.eq(3).text(),
        direction: direction === "/images/dn.gif" ? "negative" : "positive",
        day: row.eq(5).text(),
        color: color[1]
      });
    });
  } catch (e) {
    console.log("error");
  }

  res.status(200).json({ data: quotes, count: quotes.length });
  console.log("Received QUOTES");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render("error", { status: err.status, message: err.message });
});

// Listen on port 8080
var listener = app.listen(8080, function() {
  console.log("Listening on port " + listener.address().port);
});
