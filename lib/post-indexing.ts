// Existing health and home-care posts remain readable at their original URLs.
const excludedPostSlugs = new Set([
  "senior-cat-hyperthyroidism-eating-more-weight-loss",
  "cat-tooth-resorption-chewing-signs",
  "cat-chronic-kidney-disease-weight-appetite-water-log",
  "cat-lower-urinary-tract-disease-litter-box-signs",
  "senior-dog-heart-disease-sleeping-respiratory-rate",
  "dog-pancreatitis-vomiting-appetite-log",
  "dog-diabetes-water-intake-urination-log",
  "dog-periodontal-disease-eating-and-chewing-signs",
  "dog-otitis-externa-ear-odor-head-shaking",
  "dog-patellar-luxation-hind-leg-walk-observation",
  "dog-allergy-signs-skin-ear-diet-history",
  "dog-vaccination-records-personalized-plan",
  "dog-skin-changes-history-before-diagnosis",
  "dog-paw-licking-observation-vet-signs",
  "dog-cough-respiratory-signs-grooming-visit",
  "winter-dog-walk-adjustment-stop-signals",
]);

export function isPostIndexable(slug: string): boolean {
  return !excludedPostSlugs.has(slug);
}
