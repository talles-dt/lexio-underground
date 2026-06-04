// Supabase client mock with proper typing
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  User,
  Session,
  AuthTokenResponse,
  OAuthResponse,
  Provider,
  UserResponse,
} from "@supabase/supabase-js";

// Mock Supabase types
interface MockUser extends User {
  id: string;
  email: string;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
}
interface MockSession extends Session {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  refresh_token: string;
  user: MockUser;
}

// Create a mock client
const supabase: SupabaseClient = {
  from: <TableName extends string>() => ({
    insert: (values: any[]) =>
      Promise.resolve({
        data: { share_token: "mock-share-token" },
        error: null,
      }),
    select: (columns: string) => ({
      eq: () =>
        Promise.resolve({
          data: { share_token: "mock-share-token" },
          error: null,
        }),
      single: () =>
        Promise.resolve({
          data: { share_token: "mock-share-token" },
          error: null,
        }),
    }),
  }),
  auth: {
    getUser: () =>
      Promise.resolve<UserResponse>({
        data: {
          user: {
            id: "mock-user-id",
            email: "mock@example.com",
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User,
        },
        error: null,
      }),
    exchangeCodeForSession: () =>
      Promise.resolve<AuthTokenResponse>({
        data: {
          session: {
            access_token: "mock-access-token",
            token_type: "bearer",
            expires_in: 3600,
            refresh_token: "mock-refresh-token",
            user: {
              id: "mock-user-id",
              email: "mock@example.com",
              app_metadata: {},
              user_metadata: {},
              aud: "authenticated",
              created_at: new Date().toISOString(),
            } as User,
          },
          user: {
            id: "mock-user-id",
            email: "mock@example.com",
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User,
        },
        error: null,
      }),
    signInWithOAuth: (options: { provider: Provider }) =>
      Promise.resolve<OAuthResponse>({
        data: { provider: options.provider, url: "https://mock.oauth" },
        error: null,
      }),
    signInWithPassword: (_: { email: string; password: string }) =>
      Promise.resolve<AuthTokenResponse>({
        data: {
          session: {
            access_token: "mock-access-token",
            token_type: "bearer",
            expires_in: 3600,
            refresh_token: "mock-refresh-token",
            user: {
              id: "mock-user-id",
              email: "mock@example.com",
              app_metadata: {},
              user_metadata: {},
              aud: "authenticated",
              created_at: new Date().toISOString(),
            } as User,
          } as Session,
          user: {
            id: "mock-user-id",
            email: "mock@example.com",
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User,
        },
        error: null,
      }),
    signUp: (_: { email: string; password: string }) =>
      Promise.resolve<UserResponse>({
        data: {
          user: {
            id: "mock-user-id",
            email: "mock@example.com",
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User,
        },
        error: null,
      }),
    getSession: () =>
      Promise.resolve<{ data: { session: Session }; error: null }>({
        data: {
          session: {
            access_token: "mock-access-token",
            token_type: "bearer",
            expires_in: 3600,
            refresh_token: "mock-refresh-token",
            user: {
              id: "mock-user-id",
              email: "mock@example.com",
              app_metadata: {},
              user_metadata: {},
              aud: "authenticated",
              created_at: new Date().toISOString(),
            } as User,
          } as Session,
        },
        error: null,
      }),
  },
} as unknown as SupabaseClient;

export { supabase };
