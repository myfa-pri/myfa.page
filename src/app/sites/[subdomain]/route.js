import { handleSubdomainRootRequest } from "@/lib/edgeRenderer";

export async function GET(request, { params }) {
  const { subdomain } = params;
  return await handleSubdomainRootRequest(subdomain);
}
