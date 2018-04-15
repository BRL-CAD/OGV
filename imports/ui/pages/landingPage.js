/**
/*                    L A N D I N G  P A G E . J S
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

/** @file OGV/client/views/authentication/landingPage.js
 *  @brief Helper for landingPage.html
 *
 * authenticate user credentials, shows the errors if any
 */

import "./landingPage.html";
import "./landingPage.css";

Template.landingPage.helpers({
  isFillingForm() {
    return true;
  },
  landingPageModel() {
    const settings = OgvSettings.findOne();
    console.log(settings);
    if (settings) {
      return settings.landingPageModel;
    }
    sAlert.error("Check BRL-CAD installation on server.");
    return false;
  }
});
