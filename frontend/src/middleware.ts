import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// interface Payload {
//   email: string;
//   role: string;
// }

// const JWT_SECRET = Uint8Array.from(atob(process.env.JWT_SECRET || ""), (c) =>
//   c.charCodeAt(0)
// );

export default async function middelware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    // return NextResponse.redirect(new URL("/auth", request.url));
    return NextResponse.next();
  }

  try {
    // const { payload } = await jwtVerify<Payload>(token, JWT_SECRET);

    // si j'essaie d'aller sur la page de connexion alors que je suis connecté
    if (token && request.nextUrl.pathname.startsWith("/auth")) {
      // je suis redirigé vers la page d'accueil
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.next();
  }
}
