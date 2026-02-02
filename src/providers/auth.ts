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
        redirectTo: '/',
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
    if (error.statusCode === 401 || error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
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
  },
  getPermissions: async () => {
    const { data: session } = await authClient.getSession();

    if (!session?.user) return null;

    return {
      role: session.user.role,
    };
  },
  getIdentity: async () => {
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
  },
};
