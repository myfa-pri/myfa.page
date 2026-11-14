import { handleSubdomainSlugRequest } from "@/lib/edgeRenderer";

export async function GET(request, { params }) {
  const { subdomain, slug } = params;
  return await handleSubdomainSlugRequest(subdomain, slug);
}
