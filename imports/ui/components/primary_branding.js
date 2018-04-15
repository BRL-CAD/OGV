/*                     P R I M A R Y _ B R A N D I N G . J S
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
 * @file OGV/client/views/primary_branding.js
 * @brief helpers and events for the primary branding (name of the
 * website that's shown at various places.
 */

import "./primary_branding.html";

Template.primaryBranding.helpers({
  primaryBranding() {
    settings = OgvSettings.findOne();
    return settings.siteName;
  }
});
