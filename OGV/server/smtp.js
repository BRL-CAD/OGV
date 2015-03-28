Meteor.startup(function () {
	process.env.MAIL_URL='smtp://postmaster%40sandbox28785b639cdb4a9fbc9470bf69566bf9.mailgun.org:ba02351e0d2e483a7351654fbe79e088@smtp.mailgun.org:587'

	Accounts.config({
		sendVerificationEmail:true
	})
});
