/**
/*               M O D E L _ V I E W E R . J S
 * BRL-CAD
 *
 * Copyright (c) 1995-2013 United States Government as represented by
 * the U.S. Army Research Laboratory.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License
 * version 2.1 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
     * License along with this file; see the file named COPYING for more
 * information.
 */

/** @file OGV/client/views/model_viewer.js
 * Events, helpers and other logic required to render 3d models in
 * model Viewer. 
 */


Template.modelViewer.events({
    'click #sm-item-love':function()
    {
        var love = {
            postId: this._id
        };
 	Meteor.call('love', love, function(error, loveId) {
	    if (error) {
		throwError(error.reason);
	    }
	});
    },

    'click #sm-item-embed':function() 
    {
	generateEmbedCode();
    },

    'click #sm-item-comment':function() 
    {
	$('#overlay-comments').css({'bottom':'0px'});
    },

    'click #comments-close-button':function() 
    {
	$('#overlay-comments').css({'bottom':'-10000px'});
    },

});

Template.modelViewer.helpers({
    lovers: function() 
    {
	loversObj = Lovers.findOne({postId: this._id});
	if (loversObj) {
	    loversArray = loversObj.lovers;
	    return loversArray.length;
        } else {
            return 0;
        }
    },

    comments: function() 
    {
	return Comments.find({postId: this._id});
    },

    model: function() 
    {
	return this.data;
    }
});

Template.modelViewer.rendered = function() 
{
    console.log("rendered");
    model = this.data;
    objList = getObjFiles(model);	
    console.log(objList);
  
    init();
    animate();
}

/**
 * Get list of OBJ files for the current .g database
 */

function getObjFiles(model) 
{
    var objUrls = [];
    throwNotification("getting obj files");
    modelId = model._id;
    OBJFiles.find({ gFile : modelId }).forEach( function (objFile) {
	objUrls.push(objFile.url());
    });
    console.log(objUrls);
    return objUrls;
}

/**
 * Initializes the model viewer
 */
var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;
 
var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;
 
var mouseX = 0;
var mouseXOnMouseDown = 0;
 
var mouseY = 0;
var mouseYOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var finalRotationY
var guiControls, OBJMaterial, OBJMaterialOver;
var keyboard = new KeyboardState();
var renderColour = 0xafa8a8;


function getGrid(){
    axes = new THREE.AxisHelper(10000);
    group.add(axes);

    grid = new THREE.GridHelper(3000, 100);
    group.add(grid);     
    scene.add(group);
}

function init() 
{
    /**
     * Setting Up the scene: 
     * Grabs the model-container div from template into a variable
     * named container, and sets up the scene 
     */

    container = document.getElementById('model-container');
    controller = document.getElementById('controller');
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 1000;
    camera.position.x = 1000;
    camera.position.y = 1000;
 

    scene = new THREE.Scene();
    
    /**
     * Light up the scene 
     */
    ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);
 
    directionalLight = new THREE.PointLight(0xaaaaaa);
    directionalLight.position = camera.position;
    scene.add(directionalLight);
   
    
    /**
     * Loader Managerial tasks
     */
    manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) 
    {
	console.log(item, loaded, total);
    };

    /**
     * Adds the model to the viewer aka loads OBJ files 
     * using OBJ-Loader
     */
    group = new THREE.Object3D();
    loader = new THREE.OBJLoader(manager);
    
    /**
     * Adds material to the model, which hence controls 
     * how the model shall look 
     */
     
    OBJMaterial = new THREE.MeshPhongMaterial({color: Math.random() * 0x00f000}); 
    OBJMaterialOver = new THREE.MeshPhongMaterial({color: 0x000000, visible: false}); 
    for (i in objList) {
	loader.load( objList[i], function(object) {
	    object.traverse(function(child) {
		if (child instanceof THREE.Mesh) {
		    child.material = OBJMaterial;
		}
	    });

        object.position.y = 0.1;
	    object.rotation.z =  90 * Math.PI/180;
	    object.rotation.x = -90 * Math.PI/180;

	    group.add(object);
        scene.add(group);
	});
    }
    
    for (i in objList) {
    loader.load( objList[i], function(object) {
        object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = OBJMaterialOver;
        }
        });

        object.position.y = 0.1;
        object.rotation.z =  90 * Math.PI/180;
        object.rotation.x = -90 * Math.PI/180;

        group.add(object);
        scene.add(group);
    });
    }
   
    /**
    * datGUI variable initializations
    */
    guiControls = new function() {
        this.opacity = OBJMaterial.opacity;
        this.transparent = OBJMaterial.transparent;
        this.ambient = OBJMaterial.ambient.getHex();
        this.emissive = OBJMaterial.emissive.getHex();
        this.wireframe = OBJMaterial.wireframe;
        this.wireframeLinewidth = OBJMaterial.wireframeLinewidth;
        this.shininess = OBJMaterial.shininess;
        this.visible = OBJMaterial.visible;
        
        this.visible = OBJMaterialOver.visible;
        this.wireframe = OBJMaterialOver.wireframe;
        this.wireframeLinewidth = OBJMaterialOver.wireframeLinewidth;
    }

    //Initialize dat.GUI
    datGUI = new dat.GUI({autoPlace:false});
    
    /**
    * Add folders/sub categories in controls
    */
    var sceneGui = datGUI.addFolder("Scene");                   //consisting of changes to be shown in renderer or scene
    var modelGui = datGUI.addFolder("Model");                   //consisting of changes to be shown in the model
    var overmodelGui = datGUI.addFolder("WireFrame + Model");   //activated OBJMAterialOver that overlaps the existing model

    /** 
    * datGUI GUI and of variables defined above functionality
    */
    modelGui.add(guiControls, 'visible').onChange(function (e) {
        OBJMaterial.visible = e;
    });
    modelGui.add(guiControls, 'opacity', 0, 1).onChange(function (e) {
        OBJMaterial.opacity = e;
    });
    modelGui.add(guiControls, 'transparent').onChange(function (e) {
        OBJMaterial.transparent = e;
    });
    modelGui.addColor(guiControls, 'ambient').onChange(function (e) {
        OBJMaterial.ambient = new THREE.Color(e);
    });
    modelGui.addColor(guiControls, 'emissive').onChange(function (e) {
        OBJMaterial.emissive = new THREE.Color(e);
    });
    modelGui.add(guiControls, 'wireframe').onChange(function (e) {        
        OBJMaterial.wireframe = e;
    });
    modelGui.add(guiControls, 'wireframeLinewidth', 0, 10).onChange(function (e) {
        OBJMaterial.wireframeLinewidth = e;
    });
    modelGui.add(guiControls, 'shininess', 0, 100).onChange(function (e) {
        OBJMaterial.shininess = e;
    });

    overmodelGui.add(guiControls, 'visible').onChange(function (e) {
        OBJMaterialOver.visible = e;
    });
    overmodelGui.add(guiControls, 'wireframe').onChange(function (e) {        
        OBJMaterialOver.wireframe = e;
    });
    overmodelGui.add(guiControls, 'wireframeLinewidth', 0, 10).onChange(function (e) {
        OBJMaterialOver.wireframeLinewidth = e;
    });
    
    /**
     * If webgl is there then use it otherwise use canvas
     */
    if (Detector.webgl) {
	renderer = new THREE.WebGLRenderer({antialias:true});
    } else {
	renderer = new THREE.CanvasRenderer(); 
    }

    /**
     * Sets size and color to renderer
     */
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 1); 
    
    controller.appendChild(datGUI.domElement);
    container.appendChild(renderer.domElement);
    
    /**
     * orbitControls for zoom in/ zoom out and other basic controls
     */
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);    

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false ); 

    window.addEventListener('resize', onWindowResize, false);

}

/**
 * when window resizes, the size of modelviewer needs to resize
 */
function onWindowResize() 
{

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
}


function render() 
{
    /**
    * Smooth mouse movements
    */

    //horizontal rotation   
    group.rotation.y += ( targetRotationX - group.rotation.y ) * 0.1;
 
     //vertical rotation 
    finalRotationY = (targetRotationY - group.rotation.x); 
    group.rotation.x += finalRotationY * 0.01;
 
    finalRotationY = (targetRotationY - group.rotation.x);  
    if (group.rotation.x  <= 1 && group.rotation.x >= -1 ) {
         group.rotation.x += finalRotationY * 0.1;
    }
    if (group.rotation.x  > 1 ) {
        group.rotation.x = 1
    }
 
    if (group.rotation.x  < -1 ) {

        group.rotation.x = -1
    }

    renderer.render(scene, camera);    
}

function animate() 
{
    requestAnimationFrame(animate);
    render();
}


/**
 * Generate embed code for the current model, this iframe can
 * be added on any webpage to view the model.
 */
function generateEmbedCode()
{
    var thisURL = Meteor.absoluteUrl() + "/models/" + model._id;
    embedCode = "<iframe width=\"500\" height=\"250\" src=\"" + thisURL + "\" frameborder=\"0\"></iframe>";
    throwNotification(embedCode);
    return embedCode;
}


function onDocumentMouseDown( event ) {
 
        event.preventDefault();
 
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'mouseout', onDocumentMouseOut, false );
 
        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;
 
        mouseYOnMouseDown = event.clientY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;
 
}
 
function onDocumentMouseMove( event ) {
 
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
 
        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
 
}
 
function onDocumentMouseUp( event ) {
 
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
 
}
 
function onDocumentMouseOut( event ) {
 
        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
 
}

function onDocumentTouchStart( event ) { 
    
    if ( event.touches.length == 1 ) {

            event.preventDefault();

            mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
            targetRotationOnMouseDownX = targetRotationX;

            mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
            targetRotationOnMouseDownY = targetRotationY;
    
    }

}
 
function onDocumentTouchMove( event ) {
 
        if ( event.touches.length == 1 ) {
 
                event.preventDefault();
 
                mouseX = event.touches[ 0 ].pageX - windowHalfX;
                targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;
 
                mouseY = event.touches[ 0 ].pageY - windowHalfY;
                targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;
 
        }
 
}