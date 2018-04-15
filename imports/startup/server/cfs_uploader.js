/*                C F S _ U P L O A D E R . J S
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

/** @file OGV/server/cfs_uploader.js
 *  @brief uploads files to server
 *
 *  it uploads .g files to server and then converts them to .obj files
 */

Meteor.methods({
  convertFile
});

/**
 * Converts .g file to .obj and saves
 *
 * @param {string} fileId - File ID
 */

function convertFile(fileId) {
  check(fileId, String);
  /**
   * child_process
   * is required for executing shell commands
   * from within node
   */

  const convertPercentage = 0,
    modelObj = ModelFiles.findOne(fileId),
    filePath = modelObj.createReadStream("modelFiles").path;

  modelObj.update({
    $set: {
      conversion: convertPercentage
    }
  });

  modelObj.once(
    "stored",
    Meteor.bindEnvironment(() => {
      if (filePath.indexOf(".obj") === filePath.length - 4) {
        console.log("[cfs_uploader] Got .obj file, saving without converting.");
        objFile = new FS.File(filePath);
        objFile.gFile = fileId;
        OBJFiles.insert(objFile, err => {
          if (err) {
            throw new Meteor.Error(
              `Error while saving file ID - ${fileId} : ${error}`
            );
          }
          modelObj.update({
            $set: {
              conversion: 100,
              converted: true
            }
          });
        });
        return;
      }

      const { objParts, mtlPath, objects } = convertG(filePath, fileId);

      // Save mtl
      if (mtlPath) {
        console.log("TRYING TO SAVE");
        mtlFile = new FS.File(mtlPath);
        mtlFile.gFile = fileId;
        MTLFiles.insert(mtlFile, err => {
          if (err) {
            throw new Meteor.Error(err);
          }
        });
      }

      objParts.forEach((part, i) => {
        objFile = new FS.File(part);
        objFile.gFile = fileId;
        OBJFiles.insert(objFile, err => {
          if (err) {
            throw new Meteor.Error(
              `Error while saving file ID - ${fileId} : ${error}`
            );
          }
          console.log(objParts.length, i, i * 100 / objParts.length);
          modelObj.update({
            $set: {
              conversion: Math.ceil(i * 100 / (objParts.length - 1)),
              converted: true
            }
          });
          console.log(`[cfs_uploader] File #${fileId} part ${part} saved`);
          // Generate model tree
          // const tree = getModelTree(objects.split(" ").slice(-1, 1), filePath);
          // modelObj.update({
          //   $set: {
          //     converted: true,
          //     tree: JSON.stringify(tree)
          //   }
          // });
        });
      });

      // Save obj
    })
  );
}

/**
 * Converts g to obj and mtl using
 * g-obj command
 */
export function convertG(filePath, fileId) {
  const execSync = require("child_process").execSync,
    execSyncUtf = f => execSync(f, { encoding: "UTF-8" }),
    settings = OgvSettings.findOne(),
    mgedPath = settings.mgedPath,
    gobjPath = settings.gobjPath,
    uploadDirPath = filePath.substring(0, filePath.lastIndexOf("/")),
    generateTextures = Meteor.settings.generateTextures;

  // Mtl parameter helper
  const mtlParameter = path => (generateTextures ? `-t ${path}` : "");

  // Get object's parts by using mged's 'ls' command
  const objects = execSyncUtf(`${mgedPath} -c ${filePath} ls -a 2>&1`)
    .trim()
    .split(/[ \n]+/);
  const joinedObjects = objects.join(" ");

  // Get tops
  const tops = execSyncUtf(`${mgedPath} -c ${filePath} tops 2>&1`)
    .trim()
    .split(/[ \n]+/);
  const joinedTops = tops.join(" ");

  // Convert .g file to .obj and .mtl
  const mtlPath = `${uploadDirPath}/${fileId}.mtl`;

  const objParts = [];

  const objName = filePath
    .split("/")
    .pop()
    .split("-")
    .pop()
    .split(".")[0];
  console.log(`[cfs_uploader] Model ${objName}`);

  /**
   * Texture
   */
  if (generateTextures) {
    console.log(`[cfs_uploader] Try generate mtl`);
    try {
      execSyncUtf(
        `${gobjPath} ${mtlParameter(mtlPath)} ${filePath} ${joinedObjects} 2>&1`
      );
    } catch (e) {
      console.log("[cfs_uploader] Mtl generation failed.");
    }
  }

  /**
   * Merging model
   */
  console.log("[cfs_uploader] Starting converting to merged obj");
  try {
    objParts.push(`${uploadDirPath}/${objName}_merged.obj`);
    execSyncUtf(
      `${gobjPath} -n 10 -o ${uploadDirPath}/${objName}_merged.obj ${mtlParameter(
        mtlPath + ".chunk"
      )} ${filePath} ${joinedTops} 2>&1`
    );
    console.log(
      `[cfs_uploader] Converting ${uploadDirPath}/${objName}_merged.obj`
    );
  } catch (e) {
    console.log(e);
    console.log(`[cfs_uploader] Merging failed for model ${objName}`);
    objParts.pop();
  }

  /**
   * By parts
   */
  console.log("[cfs_uploader] Starting converting to obj by parts");
  objects.forEach((part, i) => {
    const partName = `${objName}_${part}_part.obj`;
    console.log(`[cfs_uploader] Converting part ${partName}`);
    try {
      objParts.push(`${uploadDirPath}/${partName}`);
      execSyncUtf(
        `${gobjPath} -n 10 -o ${uploadDirPath}/${partName} ${mtlParameter(
          mtlPath + ".chunk"
        )} ${filePath} ${part} 2>&1`
      );
    } catch (e) {
      console.log(`[cfs_uploader] Part ${part} failed. Skipping.`);
      objParts.pop();
    }
  });

  return {
    objParts,
    mtlPath: generateTextures ? mtlPath : undefined,
    joinedObjects
  };
}

/**
 * Gets array of objects and builds gets tree
 * using mged's tree command and parses it into json
 *
 * @param objectsArray - Array of .g objects
 */
function getModelTree(objectsArray, filePath) {
  const tree = {};
  const treeCommand = part => `mged -c ${filePath} tree -a -i 2 ${part} 2>&1`;
  for (const obj of objectsArray) {
    const currentObject = (tree[
      obj[obj.length - 1] === "/" ? obj.substring(0, obj.length - 1) : obj
    ] = {});
    if (obj[obj.length - 1] === "/") {
      let lines = execSync(treeCommand(obj.substring(0, obj.length - 1)), {
        encoding: "UTF-8"
      });
      lines = lines.split("\n");
      let prevIndent = 0;
      let road = [currentObject]; // eslint-disable-line
      for (const line of lines) {
        const args = line.split(/ +/);
        if (args[1] === "@") {
          road[road.length - 1][args[2]] = args[3];
        }
        if (args[1] === "u" && trimR(args[2]) !== args[2]) {
          const indent = /^ +/.exec(line);
          let indentLength = 0;
          if (indent) {
            indentLength = indent[0].length;
          }
          const indentChange = indentLength - prevIndent;
          if (indentChange < 0) {
            road.pop();
            if (road[road.length - 1] === {}) {
              delete road[road.length - 1];
            }
            for (let i = indentChange; i < 0; i += 2) {
              road.pop();
            }
            road.push((road[road.length - 1][trimR(args[2])] = {}));
          } else if (indentChange > 0) {
            road.push((road[road.length - 1][trimR(args[2])] = {}));
          } else if (indentChange === 0) {
            road.pop();
            road.push((road[road.length - 1][trimR(args[2])] = {}));
          }
          prevIndent = indentLength;
        }
      }
    }
  }
  return tree;
}

/**
 * Trims R/ from the end of the string
 */
function trimR(s) {
  if (s[s.length - 1] === "R" && s[s.length - 2] === "/") {
    s = s.substring(0, s.length - 2);
  }
  if (s[s.length - 1] === "/") {
    s = s.substring(0, s.length - 1);
  }
  return s;
}
