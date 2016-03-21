Template.cfsUploader.events({
    'dropped #dropzone': function(event, temp) 
    {
	uploadFile(event, temp);
    },

    'change #fileInput': function(event, temp)
    {
	 uploadFile(event, temp);
    }

});

function uploadFile(event, temp)
{
    FS.Utility.eachFile(event, function(file) {
	var fileId;
	var fsFile = new FS.File(file);
	fsFile.owner = Meteor.userId();
	fsFile.converted = false;
	fsFile.timeUploaded = new Date();
	fsFile.about = "The model " + fsFile.name() + " was uploaded on " + fsFile.timeUploaded;
	fsFile.thumbnail = new FS.File();
	fsFile.viewsCount = 0;
	var currentUser = Meteor.user();

	Meteor.users.update(currentUser._id, {$inc:{"profile.countModels": 1}}, function(error, res) {
		if (error) {
			sAlert.error(error.reason);
		} else {
			sAlert.success("Updated number of models for user", {effect: 'flip', onRouteClose: false, stack: false, timeout: 4000, position: 'top'});			
		}
	});
	ModelFiles.insert(fsFile,function(err) {
	    if (err) {
	    	sAlert.error("There was some error in uploading your file, please try again/later");
	    } else {
	    	sAlert.success("File Uploaded, and will appear in file manager after it's converted", {effect: 'flip', onRouteClose: false, stack: false, timeout: 4000, position: 'top'});
		}	   
	});
	Router.go("/description/" + fsFile._id);
    });
}
