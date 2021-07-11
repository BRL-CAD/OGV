import "./cfs_uploader.html";
import "./cfs_uploader.css";

// Template.cfsUploader.onCreated(function() {
//   this.currentUpload = new ReactiveVar(false);
// });

// Template.cfsUploader.helpers({
//   currentUpload() {
//     return Template.instance().currentUpload.get();
//   }
// });

Template.cfsUploader.events({
  "dropped #dropzone": function(event, temp) {
    uploadFile(event, temp);
  },

  "change #fileInput": function(event, temp) {
    uploadFile(event, temp);
  }
});

function uploadFile(e, template) {
  console.log(template);
  if (e.currentTarget.files && e.currentTarget.files[0]) {
    let fsFile = e.currentTarget.files[0];
    console.log(fsFile);
    fsFile.owner = Meteor.userId();
    console.log(Meteor.userId())
    fsFile.converted = false;
    fsFile.timeUploaded = new Date();
    fsFile.about = `The model ${fsFile.name} was uploaded on ${
      fsFile.timeUploaded
    }`;
    fsFile.viewsCount = 0;
    fsFile.conversion = 0;
    // We upload only one file, in case
    // multiple files were selected
    console.log(fsFile);
    const upload = ModelFiles.insert(
      {
        file: fsFile,
        chunkSize: "dynamic"
      },
      false
    );

    upload.on("start", function() {
      // template.currentUpload.set(this);
    });

    upload.on("end", function(error, fileObj) {
      if (error) {
        alert(`Error during upload: ${error}`);
      } else {
        // alert(`File "${fileObj.name}" successfully uploaded`);
        // console.log(fileObj);
        Router.go(`/processing/${fileObj._id}`);
      }
      // template.currentUpload.set(false);
    });

    upload.start();
  }
  // FS.Utility.eachFile(event, file => {
  //   const fsFile = new FS.File(file);
  //   fsFile.owner = Meteor.userId();
  //   fsFile.converted = false;
  //   fsFile.timeUploaded = new Date();
  //   fsFile.about = `The model ${fsFile.name()} was uploaded on ${
  //     fsFile.timeUploaded
  //   }`;
  //   fsFile.viewsCount = 0;
  //   fsFile.conversion = 0;

  //   ModelFiles.insert(fsFile, err => {
  //     if (err) {
  //       sAlert.error(
  //         "There was some error in uploading your file, please try again/later"
  //       );
  //     } else {
  //       sAlert.success(
  //         "File Uploaded, and will appear in file manager after it's converted"
  //       );
  //       Router.go(`/processing/${fsFile._id}`);
  //     }
  //   });
  // });
}
