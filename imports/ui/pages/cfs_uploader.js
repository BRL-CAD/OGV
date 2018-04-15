import "./cfs_uploader.html";
import "./cfs_uploader.css";

Template.cfsUploader.events({
  "dropped #dropzone": function(event, temp) {
    uploadFile(event, temp);
  },

  "change #fileInput": function(event, temp) {
    uploadFile(event, temp);
  }
});

function uploadFile(event) {
  FS.Utility.eachFile(event, file => {
    const fsFile = new FS.File(file);
    fsFile.owner = Meteor.userId();
    fsFile.converted = false;
    fsFile.timeUploaded = new Date();
    fsFile.about = `The model ${fsFile.name()} was uploaded on ${fsFile.timeUploaded}`;
    fsFile.viewsCount = 0;
    fsFile.conversion = 0;

    ModelFiles.insert(fsFile, err => {
      if (err) {
        sAlert.error(
          "There was some error in uploading your file, please try again/later"
        );
      } else {
        sAlert.success(
          "File Uploaded, and will appear in file manager after it's converted"
        );
      }
    });

    Router.go(`/processing/${fsFile._id}`);
  });
}
