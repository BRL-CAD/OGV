'use client';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="dashboard-container">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
