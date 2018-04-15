import "./simple_view.html";
import "../../utils/OBJLoader.js";
import "../../utils/MTLLoader.js";
import "../../utils/OrbitControls.js";
import "../../utils/Detector.js";
import Clipboard from "../../utils/clipboard.min.js";

Template.simpleView.events({
  "click #sm-item-embed": function() {
    sAlert.success("Embed code has been copied to clipboard");
  }
});

Template.simpleView.helpers({
  lovers() {
    loversObj = Lovers.findOne({
      postId: this._id
    });
    if (loversObj) {
      loversArray = loversObj.lovers;
      return loversArray.length;
    }
    return 0;
  },

  model() {
    model = ModelFiles.findOne(this._id);

    console.log("model", model);
    return model;
  },

  modelDownloadUrl() {
    model = ModelFiles.findOne(this._id);
    if (model) {
      console.log("model", model.url({ filename: `${this._id}.g` }));
      const url = model.url({ filename: `${this._id}.g` });
      return url;
    }
  },

  ownerId() {
    model = ModelFiles.findOne(this._id);
    return model.owner;
  },

  owner() {
    return Meteor.users.findOne(model.owner);
  },

  ownerDp() {
    imgId = Meteor.users.findOne(model.owner).profile.pic;
    if (imgId) {
      return ProfilePictures.findOne(imgId).url();
    }
    return "/icons/User.png";
  },

  embedCode() {
    const thisURL = `${Meteor.absoluteUrl()}models/${this._id}/shared=true`;
    embedCode = `<iframe width="500" height="250" src="${thisURL}" frameborder="0"></iframe>`;
    return embedCode;
  }
});

/**
 * Global model var
 */
let model = this.data;

Template.simpleView.rendered = function() {
  $(".comments").css("display", "block");
  model = this.data;
  objList = getObjFiles(model);

  const clipboard = new Clipboard("#sm-item-embed");

  init();
  render();
};

/**
 * Get list of OBJ files for the current .g database
 */
function getObjFiles() {
  objUrls = [];
  modelId = model._id;
  OBJFiles.find({
    gFile: modelId
  }).forEach(objFile => {
    objUrls.push(objFile);
  });
  return objUrls;
}

/**
 * 3D stuff
 */
let scene;
let camera;

/**
 * Initializes the model viewer
 */
function init() {
  /**
   * Check if embedded
   */
  const url = Router.current().url,
    parts = url.split("="),
    shared = parts.pop();
  let isEmbedded = false;
  if (shared === "true") {
    isEmbedded = true;
  }

  /**
     * Setting Up the scene:
     * Grabs the model-container div from template into a variable
     * named container, and sets up the scene
     */
  const container = document.getElementById("model-container");
  const target = document.getElementById("model-container");

  /**
     * Create a scene, that will hold all our elements such
     * as objects, cameras and lights
     */
  scene = new THREE.Scene();

  /**
     * Create a camera, which defines where we're looking at.
     */
  camera = new THREE.PerspectiveCamera(
    65,
    target.clientWidth / target.clientHeight,
    1,
    100000
  );
  camera.position.z = 2000;
  camera.position.x = 2000;
  camera.position.y = 2000;

  /**
     * Light up the scene
     */
  /*
    const ambient = new THREE.AmbientLight(0x555555)
    scene.add(ambient)

    const directionalLight = new THREE.PointLight(0xaaaaaa)
    directionalLight.position = camera.position
    scene.add(directionalLight)
    */
  const ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0xaaaaaa);
  directionalLight.position = camera.position;
  scene.add(directionalLight);

  if (!isEmbedded) {
    /** Axes */
    const axes = new THREE.AxisHelper(10000);
    scene.add(axes);

    /** Grid */
    const grid = new THREE.GridHelper(3000, 100);
    scene.add(grid);
  }

  /**
     * Loader Managerial tasks
     */
  const manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {
    console.log(`[model_viewer] Loading ${loaded}/${total} files`);
    animate();
  };

  /**
     * Adds the model to the viewer aka loads OBJ files
     * using OBJ-Loader
     */
  const group = new THREE.Object3D();
  const loader = new THREE.OBJLoader(manager);
  const mtlLoader = new THREE.MTLLoader(manager);

  /**
     * Get .mtl file
     */
  const mtlList = MTLFiles.find({
    gFile: model._id
  }).map(o => o);

  /**
     * Adds material to the model, which hence controls
     * how the model shall look
     */
  const OBJMaterialArray = [];

  if (mtlList && mtlList.length > 0) {
    mtlLoader.load(mtlList[0].url(), material => {
      material.preload();

      const OBJMaterial = new THREE.MeshPhongMaterial();
      OBJMaterialArray.push(OBJMaterial);
      loader.setMaterials(material);
      objList.forEach(obj => {
        loader.load(obj.url(), object => {
          object.position.y = 0.1;
          object.rotation.z = 90 * Math.PI / 180;
          object.rotation.x = -90 * Math.PI / 180;

          group.add(object);
          scene.add(group);
          renderer.render(scene, camera);
        });
      });
    });
  } else {
    const OBJMaterial = new THREE.MeshPhongMaterial();
    OBJMaterialArray.push(OBJMaterial);

    objList.forEach(obj => {
      console.log(obj);
      loader.load(obj.url(), object => {
        object.position.y = 0.1;
        object.rotation.z = 90 * Math.PI / 180;
        object.rotation.x = -90 * Math.PI / 180;

        group.add(object);
        scene.add(group);
        renderer.render(scene, camera);
      });
    });
  }

  /**
     * If webgl is there then use it otherwise use canvas
     */
  if (Detector.webgl) {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      devicePixelRatio: window.devicePixelRatio
    });
  } else {
    console.warn("[model_viewer] WebGL not supported. Using canvas instead.");
    renderer = new THREE.CanvasRenderer();
  }

  /**
     * Sets size and color to renderer
     */
  renderer.setSize(target.clientWidth, target.clientHeight);
  if (isEmbedded) {
    renderer.setClearColor(0, 0);
  } else {
    renderer.setClearColor(0x555555, 1);
  }
  container.appendChild(renderer.domElement);

  /**
     * orbitControls for zoom in/ zoom out and other basic controls
     */
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render);

  window.addEventListener("resize", onWindowResize, false);
  target.addEventListener("keydown", onKeyDown, false);
}

/**
 * when window resizes, the size of modelviewer needs to resize
 */
function onWindowResize() {
  const target = document.getElementById("model-container");

  camera.aspect = target.clientWidth / target.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(target.clientWidth, target.clientHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(render);
}

/**
 * onKeyDown function helps to view model from
 * different angles on keyboard button press.
 */
function onKeyDown(event) {
  switch (event.keyCode) {
    case 84:
      /* T */
      camera.position.set(0, 3000, 0); // top view
      camera.lookAt(scene.position);
      break;
    case 66:
      /* B */
      camera.position.set(0, -3000, 0); // bottom view
      camera.lookAt(scene.position);
      break;
    case 70:
      /* F */
      camera.position.set(-3000, 0, 0); // front view
      camera.lookAt(scene.position);
      break;
    case 82:
      /* R */
      camera.position.set(3000, 0, 0); // rear view
      camera.lookAt(scene.position);
      break;
    case 78:
      /* N */
      camera.position.set(2000, 2000, 2000); // Reset view using N
      camera.lookAt(scene.position);
      break;
    default:
      break;
  }
  animate();
}
