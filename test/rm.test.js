const rimraf = require('rimraf');

rimraf.windows.sync('D:/hzleaper_auto_install/aa_test_server', {
    maxRetries: 3,
});
