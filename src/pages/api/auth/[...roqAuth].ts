import { RoqAuth } from '@roq/nextjs';
import { clientConfig } from 'config';
import { createAuthorizedFetcher } from 'lib/create-authorized-fetcher';

export default RoqAuth({
  hooks: {
    // This hook is optional - and can be used to persist user information,
    // or as in the case below, send them a welcome notification
    onRegisterSuccess: async ({ user, session }) => {
      const authorizedFetcher = createAuthorizedFetcher(session.roqAccessToken);
      await authorizedFetcher(`${clientConfig.roq.backendUrl}/api/auth-callback/register`, {
        method: 'POST',
        body: JSON.stringify(user),
      });
    },

    onLoginSuccess: async ({ user, session }) => {
      const authorizedFetcher = createAuthorizedFetcher(session.roqAccessToken);
      await authorizedFetcher(`${clientConfig.roq.backendUrl}/api/auth-callback/login`, {
        method: 'POST',
        body: JSON.stringify(user),
      });
    },
  },
});
