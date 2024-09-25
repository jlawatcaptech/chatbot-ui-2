import { createClient } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { msalInstance } from '@/lib/msal/msalConfig';

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
    console.log("Middleware: MSAL")
    const accounts = msalInstance.getAllAccounts();


    // If the user is authenticated, allow access to the /login page
    console.log(`IF: 
      PATHNAME: ${request.nextUrl.pathname} 
      ACCOUNT Len: ${accounts.length}` )
    if (request.nextUrl.pathname === "/login" && accounts.length > 0) {
      
      console.log(`Middleware: entered IF` )
      return NextResponse.next();
    }
    else if (request.nextUrl.pathname === "/login" && accounts.length == 0)
    {
      console.log(`Middleware: entered ELSE IF` )      
        return NextResponse.rewrite(new URL('/error', request.url));
      
    }
    
    
    console.log(`Middleware: default response` )
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
