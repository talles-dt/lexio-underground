"use client";

import React from "react";
import dynamic from "next/dynamic";

type PalaceBlueprintProps = {
  rooms: Array<{ id: string; name: string }>;
};

const PalaceBlueprint = dynamic<PalaceBlueprintProps>(
  () =>
    import("../../src/components/PalaceBlueprint.js").then(
      (mod) => mod.default
    ),
  {
    ssr: false,
  }
);

export type { PalaceBlueprintProps };

const usePalaceStore = () => {
  return {
    rooms: [] as Array<{ id: string; name: string }>,
    initializePalace: () => {},
    palaceCreated: false,
  };
};

export default function PalaceBuilder() {
  const { rooms } = usePalaceStore();
  return <PalaceBlueprint rooms={rooms} />;
}
