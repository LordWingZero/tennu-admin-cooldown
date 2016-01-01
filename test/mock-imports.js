var admins = ['admin.tester.hostmask'];

var imports = {
    'admin': {
        'isAdmin': function(hostmask) {
            if(admins.indexOf(hostmask.hostname) > -1){
                return true;
            } else {
                return false;
            }
        }
    }
};

module.exports = imports;