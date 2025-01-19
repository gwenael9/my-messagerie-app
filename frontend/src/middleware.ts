import { NextRequest, NextResponse } from "next/server";

export default async function middelware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return handleRedirect(request);
  }
  
  try {
    // si j'essaie d'aller sur la page de connexion alors que je suis connecté
    if (token && request.nextUrl.pathname.startsWith("/auth")) {
      // je suis redirigé vers la page d'accueil
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    return handleRedirect(request);
  }
}

// Fonction pour gérer la redirection vers la page de login
function handleRedirect(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/conversations")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}