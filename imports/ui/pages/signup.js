/*                     S I G N U P . J S
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

/** @file OGV/client/views/signup.js
 *  @brief Deals with registration of new user
 *
 */

import "./signup.html";
import "../components/primary_branding.js";

Template.signUp.events({
  "submit #sign-up-form": function(e) {
    e.preventDefault();

    const signUpForm = $(e.currentTarget),
      email = trimInput(signUpForm.find("#sign-up-email").val().toLowerCase()),
      password = signUpForm.find("#sign-up-password").val(),
      passwordConfirm = signUpForm.find("#sign-up-password-confirm").val(),
      username = signUpForm.find("#sign-up-username").val();

    /**
         * Validates the sign up form fields and gives errors if any
         */

    if (
      isNotEmpty(email) &&
      isNotEmpty(password) &&
      isNotEmpty(username) &&
      isEmail(email) &&
      isAdminEmailServerOn(email) &&
      areValidPasswords(password, passwordConfirm)
    ) {
      Accounts.createUser(
        {
          email,
          password,
          profile: {
            name: username,
            bio: "Greatest 3d modeller on the planet"
          }
        },
        err => {
          if (err) {
            console.log(err);
            a = err;
            sAlert.error(err.reason);
          } else {
            sAlert.success(
              `Congrats! Check your inbox at ${email} to verify it`
            );
          }
        }
      );
    }
    return false;
  }
});
