import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string; // If no href, render as plain text
}

interface BreadcrumbProps {
  pageTitle: string;
  middleBreadcrumbs?: BreadcrumbItem[]; // Optional array of breadcrumbs between Home and pageTitle
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, middleBreadcrumbs }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">{pageTitle}</h2>
      <nav>
        <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <li>
            <Link
              className="inline-flex items-center gap-1.5"
              href="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>

          {middleBreadcrumbs?.map((crumb, index) => (
            <li key={index}>
              {crumb.href ? (
                <Link
                  className="inline-flex items-center gap-1.5"
                  href={crumb.href}
                >
                  {crumb.label}
                  <svg
                    className="stroke-current"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ) : (
                <span className="text-gray-800 dark:text-white/90">{crumb.label}</span>
              )}
            </li>
          ))}

          <li className="text-gray-800 dark:text-white/90">{pageTitle}</li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
