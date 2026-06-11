// src/types/index.d.ts
// Type declarations

// Export Pillar as a union string literal
export type Pillar = "grammar" | "logic" | "vocab" | "culture" | "comm";

declare module "nodemailer";

interface Theme {
  colors: {
    [key: string]: string;
  };
  [key: string]: any;
}

declare module "@/theme/tokens" {
  const theme: Theme;
  export default theme;
}

declare module "@/stores/learnerStore" {
  import LearnerStore from "@/types";
  export { LearnerStore };
}

// PillarRadar
declare module "@/components/PillarRadar" {
  const PillarRadar: React.FC<{ scores: Record<string, number> }>;
  export default PillarRadar;
}

// ShareCard
declare module "@/components/ShareCard" {
  const ShareCard: React.FC<{ shareToken: string }>;
  export default ShareCard;
}

// RoadmapPreview
declare module "@/components/RoadmapPreview" {
  const RoadmapPreview: React.FC<{ rooms: any[] }>;
  export default RoadmapPreview;
}

// SignupForm
declare module "@/components/SignupForm" {
  const SignupForm: React.FC;
  export default SignupForm;
}
