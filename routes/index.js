module.exports = app => {
    const downloadController = require("../controllers/downloadFile.controller");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.get("/downloadList", downloadController.downloadFileList);

    router.get("/download", downloadController.downloadFile);
  
    app.use('/', router);
  };