const { join, resolve } = require('path');
var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name: 'win_deployer',
    description: 'win_deployer',
    script: resolve('./main.js'),
    maxRestarts: 9999,
    maxRetries: 9999,
});

svc.on('uninstall', function () {
    console.log('win_deployer 注销成功!');
});

svc.on('stop', function () {
    setTimeout(() => {
        console.log('win_deployer 停止完成!');
        svc.uninstall();
    }, 1000);
});

svc.stop();
