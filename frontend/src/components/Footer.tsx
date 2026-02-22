'use client';
import { Logo, Paragraph } from '@components';
import Link from 'next/link';
import { LINKS_HOME_DATA, FOOTER_DATA } from '@data';

export default function Footer() {
  return (
    <>
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">
            <Logo />
          </div>
          <div className="footer-links">
            {LINKS_HOME_DATA.map((item) => (
              <Link href={item.href} key={item.label} className="footer-link">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-right">
          {FOOTER_DATA.map((social) => (
            <Link
              href={social.href}
              key={social.label}
              title={social.label}
              className="footer-social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </div>
      <div className="footer-copyright">
        <Paragraph paragraph="Copyright © 2025 BRL-CAD. All rights reserved." />
      </div>
    </>
  );
}
