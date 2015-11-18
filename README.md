# tennu-cooldown

A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Allows commands normally reserved for admins, to be used by regular users with a cooldown.

This plugin is for usage with select existing plugins that support it.

## IMPORTANT

### Configuration

[tennu-asay](https://github.com/LordWingZero/tennu-asay)
```javascript
"say": {
    "cooldown": 103
},
"google": {
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

        var shoutConfig = client.config("shout");
        if (!shoutConfig)
        {
            throw Error('tennu-tell: is missing some or all of its configuration.');
        }

        var isShoutCooldownReady = imports.admin.isAdmin;
        var adminCooldown = client._plugins.getRole("cooldown");
        
        if(adminCooldown)
        {
            if(!shoutConfig.cooldown) {
                client._logger.warn('shout: cooldown found, no config set.');
            } else {
                isShoutCooldownReady = adminCooldown(shoutConfig.cooldown);
                client._logger.notice('shout: cooldowns enabled: ' + shoutConfig.cooldown + ' seconds.');            
            }
        }

        return {
            handlers: {
                "!shout": function(IRCMessage) {
                    return isAdmin(IRCMessage.hostmask).then(function(result) {
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