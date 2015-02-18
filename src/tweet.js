"use strict";

var twitter = require("twitter-text"),
    twemoji = require("twemoji");

function getSource(tweet) {
    return tweet.retweeted_status? tweet.retweeted_status : tweet;
}

exports.parse = function(tweet) {
    var source = getSource(tweet),
        text   = twitter.autoLinkWithJSON(
            source.text,
            source.entities
        );
    
    // respect newlines
    text = text.replace(/\n|\r\n|\r/g, "<br />");
    
    return twemoji.parse(
        text,
        function(icon) {
            return "../node_modules/twemoji/svg/" + icon + ".svg";
        }
    );
};
