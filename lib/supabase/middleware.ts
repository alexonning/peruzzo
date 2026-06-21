import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = request.nextUrl;
  const isAdmin = url.pathname.startsWith("/admin");
  const isLogin = url.pathname === "/admin/login";

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // protege rotas /admin (exceto /admin/login)
    if (isAdmin && !isLogin && !user) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    // Falha ao criar o cliente Supabase (ex.: env vars ausentes) ou ao
    // verificar a sessão. Não derruba o site inteiro: rotas públicas seguem
    // normalmente; rotas /admin caem no login (fail-safe — sem auth, sem acesso).
    console.error("[middleware] updateSession falhou:", error);

    if (isAdmin && !isLogin) {
      const redirectUrl = url.clone();
      redirectUrl.pathname = "/admin/login";
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }
}
