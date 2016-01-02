var TypedError = require("error/typed");

var CommandNotReadyError = TypedError({
    type: 'cooldown.commandnotready',
    message: 'Command "{command}" not ready yet. Ready again {timetill}',
});

module.exports = {
    CommandNotReadyError: CommandNotReadyError
};