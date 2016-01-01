function logger() {
    return {
        "notice": function(text) {
            console.info(text);
        },
        "debug": function(text) {
            console.info(text);
        },
        "error": function(text) {
            console.error(text);
        }
    }
}

function config(value) {
    var cfg = {
        "plugins": ['admin', 'cooldown'],
        "cooldown": {
            "admin-commands": [
                'adminonly'
            ],
            "cooldown-commands": {
                "supershortcooldown": 1,
                "shortcooldown": 10,
                "mediumcooldown": 20
            }
        }
    }
    return cfg[value];
}

module.exports = {
    "config": config,
    "_logger": logger()
};