var cmd = require('node-cmd');

cmd.run(`sc query aaaaaaaaaaaaaaa.exe`, function (err, data, stderr) {
    const res = data
        .split('\r\n')
        .filter((v) => !!v)[2]
        .split(':')[1]
        .trim()
        .split(' ')[2];
    console.log(res, data);
});
