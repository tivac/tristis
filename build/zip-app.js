/*jshint node:true */
"use strict";

var fs       = require("fs"),
    path     = require("path"),
    shell    = require("shelljs"),
    archiver = require("archiver"),
    size     = require("file-size");

module.exports = function(config, done) {
    var zip  = archiver("zip", { level : 0 }),
        dest = fs.createWriteStream(path.join("./temp", config.app + ".nw"));
        
    dest.on("close", done);
    zip.on("error", done);
    
    zip.pipe(dest);
    
    shell.ls("-R", config.temp)
        .filter(function(item) {
            return fs.statSync(item).isFile();
        })
        .forEach(function(file) {
            zip.append(
                fs.createReadStream(file),
                { name : file }
            );
        });
    
    zip.finalize(function(err, bytes) {
        if (err) {
            return done(err);
        }
        
        config.log("Wrote " + size(bytes).human({ jedec : true }));
    });
};
