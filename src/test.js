var MessageCentre = require('./index.js');
MessageCentre.sub('test', { fn: function () {}, context: {}, args: [1] });
