'use client';
import { Logo } from '@components/Logo';
import { HamburgerRightIcon } from '@icons/HamburgerRight.icon';
import { LINKS_HOME_DATA } from '@/data/LinksHomeData';
import Link from 'next/link';
import { useState } from 'react';
import { PrimaryButton } from './common';
import { useRouter } from 'next/navigation';

export const NavbarHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="navbar-home-container">
      <div className="navbar-home-left">
        <Logo />
      </div>
      <div className="navbar-home-right">
        <HamburgerRightIcon
          width="28"
          height="28"
          onClick={handleMenuOpen}
          className="navbar-home-hamburger-icon"
        />
        <div className={`navbar-home-right-menu ${isMenuOpen ? 'active' : ''}`}>
          {LINKS_HOME_DATA.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="navbar-home-right-menu-item"
            >
              {item.label}
            </Link>
          ))}
          <PrimaryButton
            label="Try Now"
            onClick={() => {
              router.push('/dashboard/upload');
            }}
            className="navbar-home-try-now-button"
          />
        </div>
      </div>
    </div>
  );
};
