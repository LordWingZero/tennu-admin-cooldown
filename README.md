# tennu-cooldown

> A plugin for the [tennu](https://github.com/Tennu/tennu) irc framework.

Allows any command to be used by regular users with a cooldown.

### Requires
- [tennu-admin](https://github.com/Tennu/tennu-admin/) It is recommended to make this the first plugin defined in your tennu "plugins" config option.

### Configuration

```javascript
"cooldown": {
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