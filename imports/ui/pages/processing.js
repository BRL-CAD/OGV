import "./processing.html";
import "./processing.css";

let started = false;

Template.processing.events({
  "click #takePhoto": function() {
    const _oid = Session.get("modelId");

    console.log("started extracting data");
    const imageData = document
      .querySelector("#previewc")
      .toDataURL("image/png");

    ModelFiles.update(_oid, { $set: { screenshot: imageData } }, error => {
      if (error) {
        console.log(error);
        sAlert.error(error.reason);
      } else {
        Router.go(`/description/${_oid}`);
        sAlert.success("Updated thumbnail preview");
      }
    });
  }
});

Template.processing.helpers({
  converting() {
    const id = Session.get("modelId");
    const model = ModelFiles.findOne({ _id: id });
    if (model.conversion < 100) {
      started = false;
    }
    return model.conversion < 100;
  },

  thumbnail() {
    const id = Session.get("modelId");
    const model = ModelFiles.findOne({ _id: id });

    if (model.conversion && model.conversion == 100 && !started) {
      started = true;
      setTimeout(() => generate(), 1000);
    }
    if (model.screenshot && model.screenshot.length > 10) {
      Router.go(`/description/${id}`);
    }
  },

  thumbnailReady() {
    if (started) {
      return true;
    }
    return false;
  }
});

function generate() {
  const id = Session.get("modelId");
  const model = ModelFiles.findOne({ _id: id });

  const objList = [];

  OBJFiles.find({
    gFile: model._id
  }).forEach(objFile => {
    objList.push(objFile);
  });
  const canvas = document.createElement("canvas");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
    devicePixelRatio: window.devicePixelRatio
  });

  const width = 650;
  const height = 400;
  renderer.setSize(width, height);
  // renderer.setClearColor(0x555555, 1);

  const scene = new THREE.Scene();

  /**
     * Create a camera, which defines where we're looking at.
     */
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 200000);
  camera.position.z = 200;
  camera.position.x = 200;
  camera.position.y = 200;

  const ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0xaaaaaa);
  directionalLight.position = camera.position;
  scene.add(directionalLight);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  const manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {
    console.log(`[model_viewer] Loading ${item} ${loaded}/${total} files`);
  };

  /**
   * Adds the model to the viewer aka loads OBJ files
   * using OBJ-Loader
   */
  const group = new THREE.Object3D();
  const loader = new THREE.OBJLoader(manager);
  const mtlLoader = new THREE.MTLLoader(manager);

  renderer.domElement.id = "previewc";

  document
    .querySelector(".processing-content")
    .appendChild(renderer.domElement);

  /**
     * Get .mtl file
     */
  const mtlList = MTLFiles.find({
    gFile: model._id
  }).map(o => o);

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
}
