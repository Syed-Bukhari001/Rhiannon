import { useEffect, useState } from "react";

const readPath = () => {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/";
};

export function useHashRoute() {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onHashChange = () => setPath(readPath());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [path]);

  return path;
}

export function navigate(path) {
  window.location.hash = path;
}
