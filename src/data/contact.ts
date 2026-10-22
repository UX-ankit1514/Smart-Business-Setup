/*
 * Relationship manager shown on the recommendation screen. These are placeholder demo details chosen by the
 * product owner — replace them with a real Arnifi relationship manager before any live use.
 */
export interface ExpertContact {
  name: string;
  role: string;
  /** Display format; the tel: link strips the spaces. */
  phone: string;
  email: string;
}

export const DEMO_EXPERT: ExpertContact = {
  name: "John Smith",
  role: "Business setup consultant",
  phone: "+971 50 000 0000",
  email: "john@arnifi.com",
};
