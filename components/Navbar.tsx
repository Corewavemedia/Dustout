"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/30 backdrop-blur-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Different sizes for mobile and desktop */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="hidden md:block">
                {/* Desktop Logo - Original size */}
                <Image
                  src="/images/dustoutcolor.png"
                  alt="DustOut Logo"
                  width={150}
                  height={50}
                  className="h-14 w-auto"
                />
              </div>
              <div className="md:hidden">
                {/* Mobile Logo - Bigger size */}
                <Image
                  src="/images/dustoutcolor.png"
                  alt="DustOut Logo"
                  width={150}
                  height={50}
                  className="h-14 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="/#contact"
                className="text-blue-500 hover:text-cyan font-majer font-normal text-lg"
              >
                Contact
              </Link>
              <Link
                href="/about"
                className="text-blue-500 hover:text-cyan font-majer font-normal text-lg"
              >
                About Us
              </Link>
              <Link
                href="/#booking"
                className="text-blue-500 hover:text-cyan font-majer font-normal text-lg"
              >
                Book Us
              </Link>
              <Link
                href="/#get-started"
                className="bg-blue-700 text-white px-6 py-2 rounded-full font-majer font-normal text-lg hover:bg-mint-green transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile menu button - with green, blue, green lines */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="flex flex-col space-y-1.5 p-2 rounded"
            >
              <span className="block w-6 h-[3px] border-2 border-green-500 rounded-full"></span>
              <span className="block w-6 h-[3px] border-2 border-blue-600 rounded-full"></span>
              <span className="block w-6 h-[3px] border-2 border-green-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Larger size */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-lg mx-3 mt-2 overflow-hidden">
          <div className="py-3">
            <Link
              href="/#contact"
              className="block px-5 py-4 text-blue-700 hover:bg-blue-50 border-b border-gray-100 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="block px-5 py-4 text-blue-700 hover:bg-blue-50 border-b border-gray-100 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/#booking"
              className="block px-5 py-4 text-blue-700 hover:bg-blue-50 text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
