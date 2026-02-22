'use client';
import Link from 'next/link';
import React from 'react';
import { SIDE_BAR_DATA } from '@data';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <>
      <div
        className={`sidebar-large ${isOpen ? 'sidebar-container-open' : 'sidebar-container-closed'}`}
      >
        <div className="sidebar-links">
          {SIDE_BAR_DATA.map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className="sidebar-link"
              onClick={() => setIsOpen(false)}
            >
              <item.icon />
              <p className="sidebar-link-text">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
