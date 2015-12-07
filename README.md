# tennu-cooldown

A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Allows commands normally reserved for admins, to be used by regular users with a cooldown.

This plugin is for usage with select existing plugins that support it.

All configuration values are read as **seconds**.

## IMPORTANT

### Configuration

- [tennu-asay](https://github.com/LordWingZero/tennu-asay)
- [tennu-agoogle](https://github.com/Tennu/tennu-agoogle)
- [tennu-correction](https://github.com/Tennu/tennu-correction)
- [tennu-title](https://github.com/LordWingZero/tennu-title)
- [tennu-tell](https://github.com/LordWingZero/tennu-tell)

```javascript
"asay": {
    "cooldown": 103
},
"agoogle": {
    "cooldown": 10
},
"correction": {
    "cooldown": 10
},
"title": {
    "cooldown": 10
},
"tell": {
    "cooldown": 10
},
```

## Developers

### Adding cooldowns into your own plugin with isAdmin fallback

```Javascript
var PluginThatUsesAdminCooldown = {
    requiresRoles: ['admin'],
    init: function(client, imports) {

        const helps = {
            "shout": [
                "Let it all out!."
            ]
        };

        // Always throw a helpful error when a user is missing important configuration variables for your plugin
        var shoutConfig = client.config("shout");
        if (!shoutConfig)
        {
            throw Error(this.name + ': is missing some or all of its configuration.');
        }

        // This chunk of code is what lets tennu-cooldown take over if it exists
        // It also logs to the user that its using cooldowns
        var isAdmin = imports.admin.isAdmin;
        var adminCooldown = client._plugins.getRole("cooldown");
        if(adminCooldown)
        {
            if(!shoutConfig.cooldown) {
                client._logger.warn('shout: cooldown found, no config set.');
            } else {
                isAdmin = adminCooldown(shoutConfig.cooldown);
                client._logger.notice('shout: cooldowns enabled: ' + shoutConfig.cooldown + ' seconds.');            
            }
        }

        return {
            handlers: {
                "!shout": function(IRCMessage) {
                    return isAdmin(IRCMessage.hostmask).then(function(isadmin) {
                    
                        // isAdmin will be "undefined" if cooldown system is enabled
                        // isAdmin will be true/false if cooldown system is disabled
                        if(typeof(isadmin) === "undefined" || isadmin === true)
                        {
                            return 'Stop dont touch me there!';   
                        }                    
                    
                        if(result)
                        {
                            return 'AHH';
                        }                        
                    });
                }
            },

            help: {
                "!shout": helps.shout
            },

            commands: ["shout"]
        }
    }
};

module.exports = PluginThatUsesAdminCooldown;
```

### Installing Into Tennu

See Downloadable Plugins [here](https://tennu.github.io/plugins/).

### Todo:

- Tests