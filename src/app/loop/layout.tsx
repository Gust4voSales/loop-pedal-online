"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export default function LoopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}

      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-base-300 !text-base-content !max-w-md",
          error: {
            iconTheme: {
              primary: "hsl(var(--er))",
              secondary: "hsl(var(--erc))",
            },
          },
        }}
      />
    </div>
  );
}
