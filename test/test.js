var should = require('should');
var mocha = require('mocha');
var cache = require('../lib/cache');

var mockClient = require('./mock-client');
var mockImports = require('./mock-imports');
var mockCommandBuilder = require('./mock-command-builder');

var plugin = require('../plugin');

var pluginHooks = plugin.init(mockClient, mockImports);

// Remove me
var Promise = require('bluebird');

describe('tennu-cooldown', function() {
    describe('cooldown', function() {
        describe('non-admin', function() {
            var nonAdminHostmask = {
                nickname: 'test_nick',
                hostname: 'nonadmin.tester.hostmask'
            };
            it('Should return the command, and then return notice for cooldown on next try.', function(done) {
                var command = mockCommandBuilder('!shortcooldown', nonAdminHostmask);

                // Is there a way to do promises in order with should?
                Promise.try(function() {
                        return pluginHooks.commandMiddleware(command);
                    })
                    .then(function(result) {
                        result.should.equal(command);
                    })
                    .then(function() {
                        return pluginHooks.commandMiddleware(command)
                            .should.eventually.have.properties(['intent', 'query', 'message']);
                    })
                    .then(function() {
                        done();
                    });
            });
            it('Should return the command after the cooldown completes.', function(done) {
                var command = mockCommandBuilder('!supershortcooldown', nonAdminHostmask);
                this.timeout(3000);
                // Is there a way to do promises in order with should?
                Promise.try(function() {
                        return pluginHooks.commandMiddleware(command);
                    })
                    .then(function(result) {
                        result.should.equal(command);
                    })
                    .then(function() {
                        setTimeout(function() {
                            pluginHooks.commandMiddleware(command)
                                .should.eventually.equal(command);
                            done();
                        }, 1500);
                    });
            });
            it('Should fail if under the cooldown limit.', function(done) {
                var command = mockCommandBuilder('!mediumcooldown', nonAdminHostmask);
                // Is there a way to do promises in order with should?
                Promise.try(function() {
                        return pluginHooks.commandMiddleware(command);
                    })
                    .then(function(result) {
                        result.should.equal(command);
                    })
                    .then(function() {
                        pluginHooks.commandMiddleware(command)
                            .should.eventually.have.properties(['intent', 'query', 'message']);
                    }).then(function() {
                        done();
                    });
            });
            it('Should return the command for an admin, and override the cooldown', function(done) {
                var adminHostmask = {
                    nickname: 'test_nick',
                    hostname: 'admin.tester.hostmask'
                };
                var command = mockCommandBuilder('!shortcooldown', adminHostmask);
                pluginHooks.commandMiddleware(command).should.eventually.equal(command);
                done();
            });
        });
    });
    describe('forced admin', function() {
        it('Should deny a regular non-admin command that has been forced to an admin one', function(done) {
            var nonAdminHostmask = {
                nickname: 'test_nick',
                hostname: 'nonadmin.tester.hostmask'
            };
            var command = mockCommandBuilder('!adminonly', nonAdminHostmask);
            pluginHooks.commandMiddleware(command)
                .should.eventually.have.properties(['intent', 'query', 'message']);
            done();
        });
    });
});