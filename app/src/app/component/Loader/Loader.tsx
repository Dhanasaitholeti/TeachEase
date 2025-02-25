"use client";
import { useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function Loader() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="mx-auto md:container h-[60vh] md:mx-auto flex justify-center items-center">
      <BeatLoader
        color="#2196f3"
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
