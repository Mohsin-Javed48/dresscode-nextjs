import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

// ============================================================================
// NEXT-AUTH TYPES
// ============================================================================

export interface NextAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  guestId?: string;
}

export interface NextAuthSession {
  user: NextAuthUser;
  expires: string;
}

// ============================================================================
// AUTH CONFIGURATION
// ============================================================================

export interface AuthConfig extends NextAuthOptions {
  callbacks: {
    authorized: (params: {
      auth: NextAuthSession | null;
      request: any;
    }) => boolean;
    signIn: (params: {
      user: NextAuthUser;
      account: any;
      profile: any;
    }) => Promise<boolean>;
    session: (params: {
      session: NextAuthSession;
      user: NextAuthUser;
    }) => Promise<NextAuthSession>;
    jwt?: (params: { token: JWT; user: NextAuthUser }) => Promise<JWT>;
  };
}

// ============================================================================
// GUEST MANAGEMENT
// ============================================================================

export interface Guest {
  id: string;
  email: string;
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateGuestData {
  email: string;
  fullName: string;
}

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

export interface UseAuthReturn {
  user: NextAuthUser | null;
  session: NextAuthSession | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

// ============================================================================
// PROTECTED ROUTE TYPES
// ============================================================================

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

// ============================================================================
// AUTH MIDDLEWARE TYPES
// ============================================================================

export interface AuthMiddlewareConfig {
  matcher: string[];
  pages: {
    signIn: string;
    error?: string;
  };
  callbacks: {
    authorized: (params: { token: JWT | null; req: any }) => boolean;
  };
}
