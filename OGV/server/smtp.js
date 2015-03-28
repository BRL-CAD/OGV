Meteor.startup(function () {
	process.env.MAIL_URL='smtp://postmaster%40sandbox28785b639cdb4a9fbc9470bf69566bf9.mailgun.org:ba02351e0d2e483a7351654fbe79e088@smtp.mailgun.org:587'


	Accounts.emailTemplates.from='no-reply@yourdomain.com';
	Accounts.emailTemplates.sitename='Online Geometry Viewer';
	
	Accounts.emailTemplates.verifyEmail.subject = function(user) {
		return '[OGV BRL-CAD] Confirm your Email Address - do-not-reply';
	}

	Accounts.emailTemplates.verifyEmail.text = function(user, url) {
		return 'BRL-CAD welcomes you to the community\nTo start using Online Geometry Viewer\nClick on the give link to activate your account:\n' + url;
	}

	Accounts.config({
		sendVerificationEmail:true,
		forbidClientAccountCreation: false
	})
});
