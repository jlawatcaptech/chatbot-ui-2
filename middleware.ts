import { createClient } from "@/lib/supabase/middleware"
import { i18nRouter } from "next-i18n-router"
import { NextResponse, type NextRequest } from "next/server"
import i18nConfig from "./i18nConfig"
import { msalInstance } from '@/lib/msal/msalConfig';

export async function middleware(request: NextRequest) {
  console.debug("Middleware: i18n Result")
  const i18nResult = i18nRouter(request, i18nConfig)
  
  if (i18nResult) return i18nResult

  try {
    const { supabase, response } = createClient(request)

    const session = await supabase.auth.getSession()

    const redirectToChat = session && request.nextUrl.pathname === "/"

    if (redirectToChat) {
      const { data: homeWorkspace, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", session.data.session?.user.id)
        .eq("is_home", true)
        .single()

      if (!homeWorkspace) {
        throw new Error(error?.message)
      }

      return NextResponse.redirect(
        new URL(`/${homeWorkspace.id}/chat`, request.url)
      )
    }

    // MSAL Authentication Logic
    console.log("Middleware: MSAL")
    const accounts = msalInstance.getAllAccounts();

    if (request.nextUrl.pathname === "/login" && accounts.length === 0) {
      // User is not authenticated, redirect to Microsoft login
      const loginUrl = `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/authorize?client_id=${process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_AZURE_AD_REDIRECT_URI}&response_mode=query&scope=user.read&state=12345`;

      return NextResponse.redirect(loginUrl);
    }

    // If the user is authenticated, allow access to the /login page

    console.log("Middleware: MSAL trying login")
    if (request.nextUrl.pathname === "/login" && accounts.length > 0) {
      return NextResponse.next();
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
}
