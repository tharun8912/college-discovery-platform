/** Company name → domain for logo.clearbit.com avatars */
export const RECRUITER_DOMAINS: Record<string, string> = {
  Google: "google.com",
  Microsoft: "microsoft.com",
  Amazon: "amazon.com",
  Adobe: "adobe.com",
  Uber: "uber.com",
  Flipkart: "flipkart.com",
  "Goldman Sachs": "goldmansachs.com",
  TCS: "tcs.com",
  Infosys: "infosys.com",
  Wipro: "wipro.com",
  HCL: "hcltech.com",
  Cognizant: "cognizant.com",
  Capgemini: "capgemini.com",
  Deloitte: "deloitte.com",
  Accenture: "accenture.com",
  IBM: "ibm.com",
  "Tech Mahindra": "techmahindra.com",
  BHEL: "bhel.com",
  NTPC: "ntpc.co.in",
};

export function recruiterLogoUrl(name: string): string | null {
  const domain = RECRUITER_DOMAINS[name];
  return domain ? `https://logo.clearbit.com/${domain}` : null;
}

export function recruiterInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
