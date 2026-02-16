"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PackOpening } from "./PackOpening";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function PackOpeningWithParams() {
  const searchParams = useSearchParams();
  const setId = searchParams.get("set");

  if (!setId) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <p>No set selected. Go back and choose one.</p>
      </div>
    );
  }

  return <PackOpening setId={setId} />;
}

export default function OpenPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <LoadingSpinner size={48} />
        </div>
      }
    >
      <PackOpeningWithParams />
    </Suspense>
  );
}
