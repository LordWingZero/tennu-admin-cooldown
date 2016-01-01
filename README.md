# tennu-cooldown

> A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Allows any command to be used by regular users with a cooldown. It canalso reserve a command for admins only.

### Requires
- [tennu-admin](https://github.com/Tennu/tennu-admin/) It is recommended to make this the first plugin defined in your tennu "plugins" config option.

### Configuration

- [tennu-asay](https://github.com/LordWingZero/tennu-asay)
- [tennu-agoogle](https://github.com/Tennu/tennu-agoogle)
- [tennu-correction](https://github.com/Tennu/tennu-correction)
- [tennu-title](https://github.com/LordWingZero/tennu-title)
- [tennu-tell](https://github.com/LordWingZero/tennu-tell)

```javascript
"cooldown": {
    // This will force a command '!choose' to only be used by admins.
    "admin-commands": [
        'choose'
    ],
    "cooldown-commands": {
        "asay": 103, // 103 SECONDS
        "agoogle": 10,
        "correction": 10,
        "title": 10,
        "tell": 10
    }
}
```

### Installing Into Tennu

See Downloadable Plugins [here](https://tennu.github.io/plugins/).