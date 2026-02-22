import Image from 'next/image';
import logo from '@assets/BRLCADLOGO.png';
import Link from 'next/link';

export const Logo = () => {
  return (
    <div className="logo-container">
      <Link href="/" className="logo-link">
        <h1 className="logo-heading">OGV</h1>
        <Image src={logo} alt="logo" className="logo-image" />
      </Link>
    </div>
  );
};
