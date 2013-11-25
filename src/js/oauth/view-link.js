/*jshint maxparams:5, yui:true */
YUI.add("view-link", function(Y) {
    "use strict";

    var models = Y.namespace("Falco.Models"),
        Link;
    
    Link = Y.Base.create("link", Y.View, [], {
        css      : "oauth",
        template : Y.namespace("Falco.Templates")["oauth-link"],
        
        events : {
            ".start" : {
                click : "_startClick"
            },
            
            ".pin" : {
                submit : "_pinSubmit"
            }
        },
        
        render : function() {
            this.get("container").setHTML(this.template());
            
            return this;
        },
        
        _startClick : function(e) {
            var self = this;
            
            e.preventDefault();
            
            models.oauth.requestToken(function(error, token) {
                if(error) {
                    return console.error(error);
                }
                
                require("nw.gui").Shell.openExternal(
                    "https://twitter.com/oauth/authenticate?oauth_token=" + token
                );
            });
        },
        
        _pinSubmit : function(e) {
            var self = this,
                pin;
            
            e.preventDefault();
            
            pin = this.get("container").one("[name='pin']").get("value");
            
            models.oauth.accessToken(pin, function accessToken(error) {
                if(error) {
                    return console.error(error);
                }
                
                self.fire("linked");
            });
        }
    });
    
    Y.namespace("Falco.Views").Link = Link;

}, "@VERSION@", {
    requires : [
        // YUI
        "base-build",
        "view",
        
        // Models
        "model-oauth",
        
        // Templates
        "template-oauth-link"
    ]
});
