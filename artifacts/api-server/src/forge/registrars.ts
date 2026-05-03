export interface RegistrarOption {
  id: string;
  name: string;
  url: string;
  note: string;
}

export function buildRegistrarOptions(domain: string): RegistrarOption[] {
  const d = encodeURIComponent(domain);
  return [
    {
      id: "cloudflare",
      name: "Cloudflare Registrar",
      url: `https://dash.cloudflare.com/?to=/:account/registrar/register?domain=${d}`,
      note: "At-cost pricing, recommended if you'll deploy here.",
    },
    {
      id: "porkbun",
      name: "Porkbun",
      url: `https://porkbun.com/checkout/search?q=${d}`,
      note: "Cheap renewals, free WHOIS privacy.",
    },
    {
      id: "namecheap",
      name: "Namecheap",
      url: `https://www.namecheap.com/domains/registration/results/?domain=${d}`,
      note: "Familiar registrar, reliable support.",
    },
  ];
}
