Meteor.startup(function () {
    process.env.MAIL_URL = 'smtp://username:password@smtp.gmail.com:25';
});
