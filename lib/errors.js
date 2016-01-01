var TypedError = require("error/typed");

var CommandNotReadyError = TypedError({
    type: 'cooldown.commandnotready',
    message: 'Command not yet ready, ready again {timetill}',
});

module.exports = {
    CommandNotReadyError: CommandNotReadyError
};