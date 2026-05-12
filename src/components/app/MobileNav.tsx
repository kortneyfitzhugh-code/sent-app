import Link from "next/link";

const ITEMS = [
  { href: "/dashboard", label: "Today" },
  { href: "/modules", label: "Modules" },
  { href: "/ask-sent", label: "Ask Sent" },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 bg-carbon border-t border-cinder z-30">
      <ul className="grid grid-cols-3">
        {ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-center py-4 label hover:text-bone transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
