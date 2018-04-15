/*                F O R G O T _ P A S S W O R D . J S
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

/** @file OGV/client/views/forgot_password.js
 *  @brief Deals with forgot password form
 *
 *  Deals with the forgot password form
 */

/**
 * Things to do when submit button of forgot-password-form
 * is clicked
 */

import "./forgot_password.html";

Template.forgotPassword.events({
  "submit #forgot-password-form": function(e) {
    e.preventDefault();

    const forgotPasswordForm = $(e.currentTarget),
      email = trimInput(
        forgotPasswordForm.find("#forgot-password-email").val().toLowerCase()
      );
    /**
     * Send an email to the user if he forgets the password
     */
    if (isNotEmpty(email) && isEmail(email)) {
      Accounts.forgotPassword(
        {
          email
        },
        err => {
          if (err) {
            throwError(err.reason);
          } else {
            throwNotification(
              "Email Sent, Please check your mailbox to reset your password"
            );
          }
        }
      );
    }
    return false;
  }
});
