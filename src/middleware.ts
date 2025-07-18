import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0"; // Assuming this is your Auth0 instance

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 1. Auth0 Middleware for core authentication logic
  const auth0Response = await auth0.middleware(request);

  // If Auth0 middleware returns a redirect (e.g., for login/logout), respect it
  if (auth0Response.status === 307 || auth0Response.status === 302) {
    return auth0Response;
  }

  // 2. Protect Routes
  const session = await auth0.getSession(request); // Use auth0Response to get session context

  // Define protected paths explicitly or by pattern
  const protectedPaths = ["/", "/profile", "/settings"]; // Example protected paths

  // Check if the current path is protected ("/" matches only root exactly)
  const isProtectedRoute = protectedPaths.some(path =>
    path === '/'
      ? url.pathname === '/'
      : url.pathname.startsWith(path)
  );

  if (isProtectedRoute && !session?.user) {
    // User is not authenticated, redirect to login page
    url.pathname = "/auth/login"; // Use Auth0's login endpoint
    url.searchParams.set("returnTo", request.nextUrl.pathname); // Add returnTo query param
    return NextResponse.redirect(url);
  }

  // If a user tries to access /signin while already authenticated, redirect them
  // 4. Error Handling (Basic Example)
  // You might want more sophisticated error handling depending on your needs.
  // This is a placeholder for catching postential issues from `auth0.middleware` or `getSession`.
  if (auth0Response.status >= 400 && auth0Response.status < 600) {
    console.error(`Auth0 middleware error: ${auth0Response.status} ${auth0Response.statusText}`);
    // Optionally redirect to a custom error page
    url.pathname = "/error"; // Your custom error page
    url.searchParams.set("statusCode", auth0Response.status.toString());
    return NextResponse.redirect(url);
  }

  // If no specific action is taken, continue with the response from auth0.middleware
  // or simply allow the request to proceed if auth0Response is not a redirect.
  return auth0Response || NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
