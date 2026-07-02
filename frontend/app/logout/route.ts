import { NextResponse } from "next/server";
import { destroySessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  await destroySessionCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function GET(request: Request) {
  await destroySessionCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}
