import type { AuthProvider } from '@refinedev/core';
import { User, SignUpPayload } from '@/types';
import { authClient } from '@/lib/auth.client';

export const authProvider: AuthProvider = {
  register: async ({
    email,
    password,
    name,
    role,
    image,
    imageCldPubId,
  }: SignUpPayload) => {
    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        imageCldPubId,
      } as SignUpPayload);

      if (error) {
        return {
          success: false,
          error: {
            name: 'Registration failed',
            message:
              error?.message || 'Unable to create account. Please try again.',
          },
        };
      }

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: {
          name: 'Registration failed',
          message: 'Unable to create account. Please try again.',
        },
      };
    }
  },
  login: async ({ email, password }) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error from auth client:', JSON.stringify(error, null, 2));
        return {
          success: false,
          error: {
            name: 'Login failed',
            message: error?.message || 'Please try again later.',
          },
        };
      }

      return {
        success: true,
        redirectTo: '/dashboard',
      };
    } catch (error) {
      console.error('Login exception:', error);
      return {
        success: false,
        error: {
          name: 'Login failed',
          message: 'Please try again later.',
        },
      };
    }
  },
  logout: async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: {
          name: 'Logout failed',
          message: 'Unable to log out. Please try again.',
        },
      };
    }

    return {
      success: true,
      redirectTo: '/login',
    };
  },
  onError: async (error) => {
    const status = (error as any)?.statusCode ?? (error as any)?.response?.status;

    if (status === 401) {
      return {
        logout: true,
      };
    }

    // Don't treat 429 (rate limit) as an auth failure that should logout the user
    if (status === 429) {
      return { error };
    }

    return { error };
  },
  check: async () => {
    try {
      const { data: session } = await authClient.getSession();

      if (session) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        logout: true,
        redirectTo: '/login',
        error: {
          name: 'Unauthorized',
          message: 'Check failed',
        },
      };
    } catch (error) {
      console.error('Auth check failed (network or server error):', error);
      // Resolve with an unauthenticated response to avoid unhandled promise rejections in refine
      return {
        authenticated: false,
        logout: true,
        redirectTo: '/login',
        error: {
          name: 'Network Error',
          message: 'Unable to reach authentication server',
        },
      };
    }
  },
  getPermissions: async () => {
    try {
      const { data: session } = await authClient.getSession();

      if (!session?.user) return null;

      return {
        role: session.user.role,
      };
    } catch (error) {
      console.error('getPermissions failed:', error);
      return null;
    }
  },
  getIdentity: async () => {
    try {
      const { data: session } = await authClient.getSession();

      if (!session?.user) return null;

      return {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
        imageCldPubId: session.user.imageCldPubId,
      } as User;
    } catch (error) {
      console.error('getIdentity failed:', error);
      return null;
    }
  },
};
