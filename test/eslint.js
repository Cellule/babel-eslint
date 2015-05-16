var find = require("find");
var path = require("path");
var fs = require("fs");

var eslintRoot = path.join(
  __dirname,
  "../node_modules/eslint"
);
var eslintRuleTestDir = path.join(
  eslintRoot,
  "tests/lib/rules"
);

fs.stat(eslintRuleTestDir, function(err) {
  if (err) {
    console.warn(
      "Eslint test files are missing, make sure you linked the project",
      eslintRuleTestDir
    );
    return;
  }

  var EslintTester = require("eslint-tester");
  EslintTester.setDefaultConfig({
    parser: "babel-eslint"
  });

  ////////////////////////////////
  // Warning super hacky code ahead
  var aliases = {
    // we need eslint to use our version instead, at least until
    // https://github.com/eslint/eslint-tester/pull/20 is merged
    "eslint-tester": require.resolve("eslint-tester"),
    // We need to teach node to recognize babel-eslint, because right now it
    // doesn't exist as a module
    "babel-eslint": path.join(__dirname, "../index.js")
  };
  var module = require("module");
  var resolve_ = module._resolveFilename;
  module._resolveFilename = function(request, parent) {
    if (aliases[request]) {
      return aliases[request];
    }
    return resolve_(request, parent);
  };
  ////////////////////////////////

  var cwd = process.cwd();
  process.chdir(eslintRoot);

  find.file(eslintRuleTestDir, function(files) {
    files.forEach(function(file) {
      require(file);
    });
    // can't figure out when the tests are all done...
    //process.chdir(cwd);
  });

});


