/*                     M A I N . J S
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

// Import UI

import "../imports/ui/layouts/layout.js"; // Main layout

import "../imports/ui/components/header.js"; // Header
import "../imports/ui/components/menu_new.js"; // temp new menu
import "../imports/ui/components/preloader.js"; // Preloader
import "../imports/ui/components/error.js";

import "../imports/ui/pages/landingPage.js"; // /
import "../imports/ui/pages/model_feed.js"; // /newsfeed
import "../imports/ui/pages/profile_page.js"; // /profile
import "../imports/ui/pages/explore.js"; // /explore
import "../imports/ui/pages/signup.js"; // /sign-up
import "../imports/ui/pages/login.js"; // /log-in
import "../imports/ui/pages/cfs_uploader.js"; // /upload
import "../imports/ui/pages/dashboard.js"; // /dashboard #TODO: rename to 'settings'
import "../imports/ui/pages/model_viewer.js"; // /model/:id
import "../imports/ui/pages/404.html"; // /404
import "../imports/ui/pages/forgot_password.js"; // /forgot-password
import "../imports/ui/pages/notverified.html"; // /not-verified
import "../imports/ui/pages/model_meta.js"; // /description/:id
import "../imports/ui/pages/processing.js"; // /processing
import "../imports/ui/pages/simple_view.js"; // /view/:id

// Startup

import "../imports/startup/client/global_helper.js";
import "../imports/startup/client/sAlertConfig.js";
import "../imports/startup/client/validator.js";

/**
 * Sets reset password token.
 *
 * Checks for reset password token in the url and sets the session
 * variable resetPasswordToken accordingly. Such token shall be
 * sent to user's email-id along with the link.
 */
if (Accounts._resetPasswordToken) {
  Session.set("resetPasswordToken", Accounts._resetPasswordToken);
}

/**
 * Verifies email
 *
 * It checks if verify email token is set or not and verifies the
 * email ID accordingly. Such token shall be sent to user's email-id
 * along with a "verify your email" link.
 */
if (Accounts._verifyEmailToken) {
  Accounts.verifyEmail(Accounts._verifyEmailToken, err => {
    if (err) {
      Session.set("alert", err.message);
    } else {
      Session.set("alert", "Your email is verified");
    }
  });
}

/**
 * Subscribe to various collections
 *
 */
Meteor.subscribe("sharedModels");
Meteor.subscribe("objFiles");
Meteor.subscribe("mtlFiles");
Meteor.subscribe("comments");
Meteor.subscribe("lovers");
Meteor.subscribe("profilePictures");
Meteor.subscribe("ogvSettings");
Meteor.subscribe("profiles");
Meteor.subscribe("notifications");
Meteor.subscribe("posts");

/*
 * Routing
 *
 */

Router.configure({
  layoutTemplate: "layout",
  notFoundTemplate: "error",
  loadingTemplate: "preloader"
});

/**
 * Mapping urls to template names
 */

Router.map(function() {
  this.route("landingPage", { path: "/" });
  this.route("signUp", { path: "sign-up" });
  this.route("feedbackThanks", { path: "thanks" });
  this.route("logIn", { path: "log-in" });
  this.route("notVerified", { path: "not-verified" });
  this.route("forgotPassword", { path: "forgot-password" });
  this.route("home", { path: "home" });
  this.route("cfsUploader", {
    path: "upload",
    waitOn() {
      return Meteor.subscribe("modelFiles");
    }
  });
  this.route("processing", {
    path: "/processing/:_id",
    waitOn() {
      return Meteor.subscribe("modelFiles");
    },
    data() {
      const model = ModelFiles.findOne({ owner: Meteor.user()._id });
      if (model == null) {
        Router.go("/upload");
        return false;
      }
      Session.set("modelId", this.params._id);
      return ModelFiles.findOne(this.params._id);
    }
  });

  this.route("dashboard", {
    path: "dashboard",
    waitOn() {
      return Meteor.subscribe("ogvSettings");
    }
  });

  this.route("modelViewer", {
    path: "/models/:_id/:_share?",
    waitOn() {
      return Meteor.subscribe("modelFiles");
    },
    data() {
      return ModelFiles.findOne(this.params._id);
    },
    action() {
      if (this.ready()) this.render();
    },
    onRun() {
      ModelFiles.update(this.params._id, { $inc: { viewsCount: 1 } });
      this.next();
    }
  });

  this.route("simpleView", {
    path: "/view/:_id",
    waitOn() {
      return Meteor.subscribe("modelFiles");
    },
    data() {
      return ModelFiles.findOne(this.params._id);
    },
    action() {
      if (this.ready()) this.render();
    },
    onRun() {
      ModelFiles.update(this.params._id, { $inc: { viewsCount: 1 } });
      this.next();
    }
  });

  this.route("modelMeta", {
    path: "/description/:_id",
    waitOn() {
      return Meteor.subscribe("modelFiles");
    },
    data() {
      const model = ModelFiles.findOne({ owner: Meteor.user()._id });
      if (model == null) {
        Router.go("/upload");
        return false;
      }
      Session.set("modelId", this.params._id);
      return ModelFiles.findOne(this.params._id);
    }
  });

  this.route("profilePage", {
    path: "/profile/:_id",
    waitOn() {
      return [
        Meteor.subscribe("userProfile", this.params._id),
        Meteor.subscribe("modelFiles")
      ];
    },
    data() {
      const id = this.params._id;
      personVar = Meteor.users.findOne({ _id: id });
      return {
        person: personVar
      };
    }
  });

  this.route("explore", {
    path: "/explore",
    waitOn() {
      Meteor.subscribe("modelFiles");
    }
  });

  this.route("models", {
    path: "/newsfeed/:modelId?",
    waitOn() {
      Meteor.subscribe("modelFiles");
    }
  });
});

// add the dataNotFound plugin, which is responsible for
// rendering the dataNotFound template if your RouteController
// data function returns a falsy value
Router.plugin("dataNotFound", {
  notFoundTemplate: "error"
} );

/**
 * Some routes are shown only when user has a valid email
 * address
 */
function validateUser() {
  if (Meteor.user()) {
    this.next();
  } else if (Meteor.loggingIn()) {
    this.render("preloader");
  } else {
    this.render("logIn");
  }
}

/**
 * actionReady shows a route only after it has fetched all
 * the required data.
 */
function actionReady() {
  if (this.ready()) {
    this.next();
  } else {
    this.render("preloader");
  }
}

/**
 * While the user is still logging in, all the routes should
 * show a preloader
 */
function loggingIn() {
  if (Meteor.loggingIn()) {
    this.render("preloader");
  } else {
    this.next();
  }
}

/**
 * Remove notifactions and error messages that have been seen
 * everytime a route is changed
*/

Router.onBeforeAction(validateUser, {
  only: [
    "cfsUploader",
    "filemanager",
    "dashboard",
    "modelMeta",
    "newsfeedSidebar",
    "models",
    "modelFeed",
    "profilePage",
    "index"
  ]
});
Router.onBeforeAction(actionReady, {
  only: ["index", "modelViewer", "explore", "models", "modelFeed"]
});
Router.onBeforeAction(loggingIn);

/*
 * Local Variables:
 * mode: javascript
 * tab-width: 8
 * End:
 * ex: shiftwidth=4 tabstop=8
 */
