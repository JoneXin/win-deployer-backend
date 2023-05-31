const { join } = require('path');
var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'win_deployer',
    description: 'win_deployer',
    script: join(__dirname, '../dist/main.js'),
    maxRestarts: 9999,
    maxRetries: 9999,
});

svc.on('stop', function () {
    console.log('win_deployer 停止完成!');
});

svc.stop();
