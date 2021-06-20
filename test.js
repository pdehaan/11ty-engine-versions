const getEngineVersions = require("./index");

getEngineVersions("@11ty/eleventy", ["ejs", "hamljs", "handlebars", "liquidjs", "nunjucks", "pug"])
  .then(res => console.log(JSON.stringify(res, null, 2)))
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  });
