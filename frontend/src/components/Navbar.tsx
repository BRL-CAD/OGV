'use client';
import React from 'react';
import { Logo } from './Logo';
import { HamburgerIcon } from '@icons/Hamburger.icon';
import { CrossIcon } from '@icons/Cross.icon';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Navbar = ({ isOpen, setIsOpen }: NavbarProps) => {
  return (
    <>
      <div className="navbar-container">
        {isOpen ? (
          <CrossIcon className="cross-icon" onClick={() => setIsOpen(false)} />
        ) : (
          <HamburgerIcon
            className="hamburger-icon"
            onClick={() => setIsOpen(true)}
          />
        )}
        <Logo />
      </div>
    </>
  );
};
