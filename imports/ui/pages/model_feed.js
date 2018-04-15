/*                     M O D E L _ F E E D . J S
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

/**
 * @file OGV/client/views/model_feed.js
 * @brief helpers and events for model feed
 *
 * Model Feed is a place where all the models by all the users are shown.
 * Model Feed is comprised of Model Posts, each Model Post is for one
 * model and further has Model View that shows representative image of the
 * model in model feed. Apart from these 3 sub parts model feed also contain
 * various social elements which are taken care of in other files such as
 * OGV/clients/views/social.js
 */

import "./model_feed.html";
import "../components/models.html";
import "../components/social.js";
import "../components/newsfeed_sidebar.js";

Template.modelFeed.helpers({
  /**
     * models helper finds all the models from the database and then sorts
     * them in reverse chronological order.
     */
  posts() {
    const currentUser = Meteor.user();
    const audience = ["public", "followers"];
    posts = Posts.find(
      {
        audience: {
          $in: audience
        },
        postedBy: {
          $in: currentUser.profile.following.concat(currentUser._id)
        }
      },
      {
        sort: {
          postedAt: -1
        }
      }
    );

    if (posts.count()) {
      return posts;
    }
    return false;
  }
});
