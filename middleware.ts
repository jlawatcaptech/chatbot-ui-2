import { createClient } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { msalInstance } from '@/lib/msal/msalConfig';
import Cookies from 'universal-cookie';

export async function middleware(request: NextRequest) {

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
    // Retrieve MSAL account from cookies
    const cookies = new Cookies(request.headers.get('cookie'));
    const msalAccountCookie = cookies.get('msalAccount');
    const msalAccount = msalAccountCookie ? JSON.parse(msalAccountCookie) : null;
   

    // If the user is authenticated, allow access to the /login page
    if (request.nextUrl.pathname === "/login" && msalAccount) {
      return NextResponse.next();
    }
    else if (request.nextUrl.pathname === "/login" && !msalAccount)
    {
        return NextResponse.rewrite(new URL('/error', request.url));
      
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
