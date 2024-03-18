// azure-ad.strategy.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { getEnv } from 'src/submodules/configs/env.config';

const config = {
  credentials: {
    tenantID: getEnv('SSO_AZURE_TENANT_ID'),
    clientID: getEnv('SSO_AZURE_CLIENT_ID'),
  },
  metadata: {
    authority: 'login.microsoftonline.com',
    discovery: '.well-known/openid-configuration',
    version: 'v2.0',
  },
  settings: {
    validateIssuer: true,
    passReqToCallback: false,
    loggingLevel: 'info',
  },
};

@Injectable()
export class AzureAdStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad-bearer',
) {
  constructor() {
    super({
      identityMetadata: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}/${config.metadata.discovery}`,
      issuer: `https://${config.metadata.authority}/${config.credentials.tenantID}/${config.metadata.version}`,
      clientID: config.credentials.clientID,
      validateIssuer: config.settings.validateIssuer,
      passReqToCallback: config.settings.passReqToCallback,
      loggingLevel: config.settings.loggingLevel,
      loggingNoPII: false,
      skipUserProfile: true,
      useCookieInsteadOfSession: false,
      clientSecret: getEnv('SSO_AZURE_CLIENT_ID'),
    });
  }

  async validate(profile: any): Promise<any> {
    console.log('profile', profile);
    return profile;
  }
}
export const AzureADGuard = AuthGuard('azure-ad-bearer');
