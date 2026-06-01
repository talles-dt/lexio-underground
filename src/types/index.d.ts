// Global type declarations

// Supabase
declare module "@/lib/supabase" {
  import { SupabaseClient } from "@supabase/supabase-js";
  export const supabase: SupabaseClient;
}

// Theme tokens
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

// LearnerStore
declare module "@/stores/learnerStore" {
  import LearnerStore from "@/types";
  export { LearnerStore };
}

// PillarRadar
declare module "@/components/PillarRadar" {
  const PillarRadar: React.FC<{ scores: Record<string, number> }>;
  export default PillarRadar;
}

// Other components
declare module "@/components/ShareCard" {
  const ShareCard: React.FC<{ shareToken: string }>;
  export default ShareCard;
}

declare module "@/components/RoadmapPreview" {
  const RoadmapPreview: React.FC<{ rooms: any[] }>;
  export default RoadmapPreview;
}

declare module "@/components/SignupForm" {
  const SignupForm: React.FC;
  export default SignupForm;
}
