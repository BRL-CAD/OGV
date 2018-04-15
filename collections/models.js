/*                     M O D E L S . J S
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

/** @file OGV/client/views/models.js
 *  @brief All the collections and it's related function regarding
 *  models
 */

/**
 * gStore is the store where model files are stored. It hosts a
 * function called transformWrite that calls a function which
 * converts g files into obj files.
 */
gStore = new FS.Store.FileSystem("modelFiles", {
  transformWrite(fileObj, readStream, writeStream) {
    const fileId = fileObj._id;

    Meteor.call("convertFile", fileId, err => {
      if (err) {
        throw new Meteor.Error("590", err.reason);
      }
    });

    /* g files are not actually converted into obj files but
 * a g file is used to get a number of obj files, so it's
 * piped as it is.
 */

    readStream.pipe(writeStream);
  }
});

/**
 * Model files is a collection that stores FS.FILE object of .g
 * file uploaded by user
 */

ModelFiles = new FS.Collection("modelFiles", {
  stores: [gStore]
});

ModelFiles.allow({
  insert(userId, file) {
    if (file.extension() === "g" || file.extension() === "obj") {
      return true;
    }
    return false;
  },
  update(userId, file, fieldNames, modifier) {
    return (
      (userId && file.owner === userId) || modifier.$inc.viewsCount !== userId
    );
  },
  download() {
    return true;
  },
  remove(userId, file) {
    return userId && file.owner === userId;
  }
});

/**
 * OBJFiles is a collection for all the obj files that get generated
 * after conversion from g file.
 */

OBJFiles = new FS.Collection("objFiles", {
  stores: [new FS.Store.FileSystem("objFiles")]
});

OBJFiles.allow({
  insert(userId) {
    return !!userId;
  },
  update(userId) {
    return !!userId;
  },
  download() {
    return true;
  },
  remove(userId, file) {
    return userId && file.owner === userId;
  }
});

/**
 * MTLFiles is a collection for all the .mtl files that get generated
 * after conversion from g file.
 */

MTLFiles = new FS.Collection("mtlFiles", {
  stores: [new FS.Store.FileSystem("mtlFiles")]
});

MTLFiles.allow({
  insert(userId) {
    return !!userId;
  },
  update(userId) {
    return !!userId;
  },
  download() {
    return true;
  },
  remove(userId, file) {
    return userId && file.owner === userId;
  }
});
