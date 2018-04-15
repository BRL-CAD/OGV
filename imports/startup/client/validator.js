/*                     V A L I D A T O R . J S
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

/** @file OGV/client/views/authentication/validator.js
 *  @brief Validation functions for the authentication forms
 *
 */

/**
 * Removes extra unwanted characters
 * @return trimmed value
 */
trimInput = function(value) {
  return value.replace(/^s*$/g, "");
};

/**
 * Checks whether input field is empty or filled
 */
isNotEmpty = function(value) {
  if (value && value !== "") {
    return true;
  }
  sAlert.error("Please fill in all the fields");
  return false;
};

/**
 * Validates the email field, it should be a proper email address
 */

isEmail = function(value) {
  const filter = /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; // eslint-disable-line
  if (filter.test(value)) {
    return true;
  }
  sAlert.error("Your email address is not valid");
  return false;
};

/**
 * Validates the password, password shall be more than 6 characters
 */

isValidPassword = function(password) {
  if (password.length < 6) {
    sAlert.error("Password should be at-least 6 characters long");
    return false;
  }
  return true;
};

/**
 * Checks if password field and confirm password field match
 */

areValidPasswords = function(password, confirmPassword) {
  if (!isValidPassword(password)) {
    return false;
  }
  if (password !== confirmPassword) {
    sAlert.error("Password and confirm-password fields don't match");
    return false;
  }
  return true;
};
