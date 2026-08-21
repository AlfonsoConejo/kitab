export type FeatureStatus =
  | "implemented"
  | "developing"
  | "upcoming";

export interface Feature {
  id: number;
  title: string;
  description: string;
  status: FeatureStatus;
}