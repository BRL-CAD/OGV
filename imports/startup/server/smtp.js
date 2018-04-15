/**
/*                    S M T P . J S
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

/** @file OGV/client/views/authentication/smtp.js
 *  configures mailing system for emailVerification and forgotPassword
 *  consists of changes to emailTemplates for the same
 */
const username =
  "postmaster%40sandbox5cb71a0119964fde80f91c415ef345a2.mailgun.org";
Meteor.startup(() => {
  smtp = {
    username,
    password: "b38c82be7ed0b4046bdc856547c655d3",
    server: "smtp.mailgun.org",
    port: 587
  };

  process.env.MAIL_URL =
    `smtp://${encodeURIComponent(smtp.username)}` +
    `:${encodeURIComponent(smtp.password)}@` +
    `${encodeURIComponent(smtp.server)}:${smtp.port}`;

  Accounts.emailTemplates.from = "no-reply@yourdomain.com";
  Accounts.emailTemplates.sitename = "Online Geometry Viewer";

  Accounts.emailTemplates.verifyEmail.subject = function() {
    return "[OGV BRL-CAD] Confirm your Email Address - do-not-reply";
  };

  Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    return `BRL-CAD welcomes you to the community
To start using Online Geometry Viewer
Click on the give link to activate your account:
${url}\n\nThank You`;
  };

  Accounts.emailTemplates.resetPassword.subject = function() {
    return "[OGV BRL-CAD] Reset Password - do-not-reply";
  };

  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    return `How could you do this
Well everything's gonaa be fine, trust us
Just click on the link below to change your password:
 ${url}\n\nThank You`;
  };
});
