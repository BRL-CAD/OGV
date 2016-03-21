Meteor.methods({
    saveFile: function(blob, name, uploadPath, encoding) 
    {
	var fs = Npm.require('fs'),
	    sys = Npm.require('sys'),
	    exec = Npm.require('child_process').exec,
	    path = Npm.require('path'),
	    name = cleanName(name || 'file'),
	    ext = path.extname(name),
	    encoding = encoding || 'binary',
	    appRoot = process.env.PWD + '/public/models/',
	    userId = Meteor.userId(),
	    fileUploaded = false;

		userDirPath = appRoot + userId + '/';
		uploadDirPath = userDirPath + name + '/';
		uploadFilePath = uploadDirPath + name;
		console.log(uploadDirPath);	
		if (ext == '.obj') {
		    if (!fs.existsSync(uploadDirPath)) {
			if (!fs.existsSync(userDirPath)) {
			    fs.mkdirSync(userDirPath);
			}
			fs.mkdirSync(uploadDirPath);
			console.log("directory created");
			fs.writeFileSync(uploadFilePath, blob, encoding);
			fileUploaded = true;
		    } else if (fs.existsSync(uploadFilePath)) {
		    	throw (new Meteor.Error(409, 'File Already Exists'));
		    } else {
			fs.writeFileSync(uploadFilePath, blob, encoding);
			fileUploaded = true;
		    }	
	         } else {
		     throw (new Meteor.Error (409,'File type not supported'));
		 }	
		
		if (fileUploaded) {
		    var model = {
		    	name: name,
		    	userId: userId,
			path: uploadFilePath,
		  	lovemeter: 0,
			lovers: []
		    }
		    model._id = Models.insert(model);
		}
		
		/*fs.mkdirSync(uploadDirPath);
		console.log("directory created");
		fs.writeFileSync(uploadFilePath, blob, encoding);
		fileUploaded = true;
	    } else if (fs.existsSync(uploadFilePath)) {
	    	throw (new Meteor.Error(409, 'File Already Exists'));
	    } else {
		fs.writeFileSync(uploadFilePath, blob, encoding);
		fileUploaded = true;
	    }	
         } else {
	     throw (new Meteor.Error (409,'File type not supported'));
	 }	
	
	if (fileUploaded) {
	    var model = {
	    	name: name,
	    	userId: userId,
		path: uploadFilePath,
	  	lovemeter: 0,
		lovers: []
	    }
	    model._id = Models.insert(model);
	}
	*/
	function gToObj()
	{
	    var objects;
	    var mgedPath = '/usr/brlcad/dev-7.25.0/bin/mged';
	    var g_objPath = '/usr/brlcad/dev-7.25.0/bin/g-obj';
	    var cmd = mgedPath + " -c  " + uploadFilePath +" ls -a 2>&1";
	    
	    child = exec(cmd, function (error, stdout, stderr) {
		sys.print('stdout' + stdout);
		objects = stdout.split(" ");
		console.log(objects);
		sys.print('stderr' + stderr);
		if (error != null) {
		    console.log('exec error: ' + error);
	        }
		for (i in objects) {
		    cmd = g_objPath + " -n 10 -o " + uploadDirPath + objects[i] + ".obj " + uploadFilePath  + " " +  objects[i];
            console.log(cmd); 
            child = exec(cmd, function (error, stdout, stderr) {
				sys.print(stdout);
   	    	});
   	    	
   	    	var cmd_color = mgedPath + " wmater " + uploadDirPath + objects[i]+ " " + uploadFilePath;
   	    	console.log(cmd_color); 
   	    	child = exec(cmd_color, function (error, stdout, stderr) {
				sys.print(stdout);
   	    	});
	    }
	    });



	}
		function cleanPath(str) 
		{
		    if (str) {
			return str.replace(/\.\./g,'').replace(/\/+/g,'').replace(/^\/+/,'').replace(/\/+$/,'');
		    }
		}

		function cleanName(str) 
		{
		    return str.replace(/\.\./g,'').replace(/\//g,'');
		}	
    }
});
    
