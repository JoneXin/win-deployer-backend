const { join, resolve } = require('path');
var { Service, isAdminUser } = require('node-windows');

const args = process.argv[2];

// Create a new service object
var svc = new Service({
    name: 'win_deployer',
    description: 'win_deployer',
    script: join('./dist/main.js'),
    maxRestarts: 9999,
    maxRetries: 9999,
});

isAdminUser((admin) => {
    console.log(admin);
});

if (args === 'start') {
    svc.on('start', function () {
        console.log('win_deployer 启动完成!');
    });

    return svc.start();
}

if (args === 'stop') {
    return svc.stop();
}

if (args === 'restart') {
    svc.stop();
    svc.on('stop', function () {
        svc.start();
    });
    svc.on('start', function () {
        console.log('win_deployer 启动完成!');
    });
}

if (args === 'uninstall') {
    svc.stop();
    svc.on('stop', function () {
        return svc.uninstall();
    });
    svc.on('uninstall', function () {
        console.log('win_deployer 注销成功!');
    });
}

if (args === 'install') {
    svc.on('install', function () {
        svc.start();
        console.log('win_deployer 注册启动成功!');
    });

    svc.install();
}
