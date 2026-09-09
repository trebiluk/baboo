import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import Studio from "@/studio/App";
import { ErrorBoundary } from "@/studio/components/ErrorBoundary";
import { installGlobalErrorTraps } from "@/studio/store/useDebugStore";
import "@/studio/index.css";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

function Home() {
  useEffect(() => {
    installGlobalErrorTraps();
  }, []);
  return (
    <ErrorBoundary label="root">
      <Studio />
    </ErrorBoundary>
  );
}