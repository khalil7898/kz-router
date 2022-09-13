const path = require("path");
const fs = require("fs");
const express = require("express");

const useRouter = (config = {}) => {
  function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
      var name = dir + "/" + files[i];
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
    return files_;
  }
  const { folder = "web", dir, router = express.Router() } = config;

  const routerDir = dir || path.join(__dirname, folder);

  const files = getFiles(routerDir);

  const routers = files.map((file) => {
    const module = require(file);
    const path = file
      .replace(routerDir, "")
      .replace("index", "")
      .replace(".js", "");
    return { module, path };
  });

  console.log(routers);

  routers.forEach(({ module, path }) => {
    const methodes = Object.keys(module);
    methodes.forEach((method) => {
      let callbacks = [];
      if (typeof module[method] === "function") callbacks.push(module[method]);
      else callbacks = [...module[method]];

      router[method](path, ...callbacks);
    });
  });
  return router;
};

module.exports = { useRouter };
