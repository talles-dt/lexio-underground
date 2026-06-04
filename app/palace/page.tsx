"use client";

import React from "react";
import dynamic from "next/dynamic";

const PalaceBlueprint = dynamic<PalaceBlueprintProps>(
  () => import("../../src/components/PalaceBlueprint.js").then((mod) => mod.default),
  {
    ssr: false,
  }
);

type PalaceBlueprintProps = {
  rooms: Array<{ id: string; name: string }>;
};

export type { PalaceBlueprintProps };

const usePalaceStore = () => {
  return {
    rooms: [],
    initializePalace: () => {},
    palaceCreated: false,
  };
};

export default function PalaceBuilder() {
  const { rooms } = usePalaceStore(); // Placeholder
  return <PalaceBlueprint rooms={rooms} />;
}
