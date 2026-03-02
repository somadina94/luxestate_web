"use client";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="flex flex-col md:flex-row gap-4 justify-between px-2 border-y py-2">
        <nav className="flex flex-col gap-2">
          <h2 className="text-lg text-gray-500">Home</h2>
          <Link href="/">Hero section</Link>
          <Link href="/about#about-features-heading">Features</Link>
          <Link href="/">Properties</Link>
          <Link href="/">Testimonials</Link>
          <Link href="/">Faqs</Link>
        </nav>
        <nav className="flex flex-col gap-2">
          <h2 className="text-lg text-gray-500">About us</h2>
          <Link href="/about">Our story</Link>
          <Link href="/">Our works</Link>
          <Link href="/">How it works</Link>
          <Link href="/">Our team</Link>
          <Link href="/">Our clients</Link>
        </nav>
        <nav className="flex flex-col gap-2">
          <h2 className="text-lg text-gray-500">Properties</h2>
          <Link href="/">For Sell</Link>
          <Link href="/">For Rent</Link>
        </nav>
        <nav className="flex flex-col gap-2">
          <h2 className="text-lg text-gray-500">Services</h2>
          <Link href="/">Valuation Mastery</Link>
          <Link href="/">strategic Marketing</Link>
          <Link href="/">Negotiation Wizardry</Link>
          <Link href="/">Closing Success</Link>
          <Link href="/">Property Management</Link>
        </nav>
        <nav className="flex flex-col gap-2">
          <h2 className="text-lg text-gray-500">Contact us</h2>
          <Link href="/">Contact Form</Link>
          <Link href="/">Our Offices</Link>
        </nav>
      </div>
      <div className="px-2">
        <p>@{year} Luxestate. All rights reserved</p>
      </div>
    </footer>
  );
}
