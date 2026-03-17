"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

export function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    // Only observe anchor links (starting with #), not full routes
    NAV_ITEMS.forEach(({ href }) => {
      if (href.startsWith("#")) {
        const el = document.querySelector(href);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 z-40 w-full border-b border-border-subtle bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="font-heading text-xl font-bold text-primary">
          PACIFIQUE!
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          {NAV_ITEMS.map((item) => {
            const isAnchor = item.href.startsWith("#");
            const sectionId = isAnchor ? item.href.replace("#", "") : "";
            const isActive = isAnchor && activeSection === sectionId;

            const linkClass = `rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? "font-semibold text-primary"
                : "text-text-body hover:text-primary"
            }`;

            if (isAnchor) {
              return (
                <a key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                  {isActive && (
                    <span className="mt-0.5 block h-0.5 rounded-full bg-primary" />
                  )}
                </a>
              );
            }

            return (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-md text-text-body hover:text-primary lg:hidden"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <nav className="border-t border-border-subtle bg-white py-2 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const isAnchor = item.href.startsWith("#");
            const sectionId = isAnchor ? item.href.replace("#", "") : "";
            const isActive = isAnchor && activeSection === sectionId;

            const linkClass = `block px-4 py-3 text-sm transition-colors ${
              isActive
                ? "bg-bg-lavender font-semibold text-primary"
                : "text-text-body hover:text-primary"
            }`;

            if (isAnchor) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClass}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={linkClass}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
