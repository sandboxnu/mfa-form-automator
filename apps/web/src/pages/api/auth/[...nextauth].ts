import NextAuth from 'next-auth';
import AzureAdProvider from 'next-auth/providers/azure-ad';

// source: https://stackoverflow.com/questions/75164721/nextauth-refresh-token-with-azure-ad

async function refreshAccessToken(accessToken: any) {
  try {
    const url = process.env.AZURE_AD_TOKEN_ENDPOINT as string;
    const req = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:
        `grant_type=refresh_token` +
        `&client_secret=${process.env.AZURE_AD_CLIENT_SECRET}` +
        `&refresh_token=${accessToken.refreshToken}` +
        `&client_id=${process.env.AZURE_AD_CLIENT_ID}`,
    });

    const res = await req.json();
    return {
      ...accessToken,
      accessToken: res.access_token,
      accessTokenExpires: Date.now() + res.expires_in * 1000,
      refreshToken: res.refresh_token || accessToken.refreshToken, // Keep the old refresh token, if the new one is not provided
    };
  } catch (error) {
    console.log(error);
  }
}

export const authOptions = {
  providers: [
    AzureAdProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_AD_TENANT_ID as string,
      authorization: {
        params: {
          scope:
            'offline_access openid profile email Application.ReadWrite.All Directory.ReadWrite.All ' +
            'Group.ReadWrite.All GroupMember.ReadWrite.All User.Read User.ReadWrite.All',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && profile) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at * 1000;
        token.refreshToken = account.refresh_token;

        token.id = profile.oid; // For convenience, the user's OID is called ID.
        token.groups = profile.groups;
        token.username = profile.preferred_username;
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }: any) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.groups = token.groups;
      session.user.username = token.username;

      if (!session.user.email) {
        session.user.email = token.username;
      }

      const splittedName = session.user.name.split(' ');
      session.user.firstName = splittedName.length > 0 ? splittedName[0] : null;
      session.user.lastName = splittedName.length > 1 ? splittedName[1] : null;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'next-auth-secret',
};

export default NextAuth(authOptions);
