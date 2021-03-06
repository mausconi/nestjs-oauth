import { CanActivate, NestInterceptor } from '@nestjs/common';

/**
 * G E N E R A L   I N T E R F A C E S
 */

export interface ControllerOptions {
  root: {
    path: string;
    guards?: (CanActivate | Function)[];
  };
  callback: {
    path: string;
    interceptors?: (NestInterceptor<any, any> | Function)[];
  };
}

export interface ServiceOptions {
  scope?: string[];
  clientId: string;
  prompt?: string;
  clientSecret: string;
  callbackUrl?: string;
  state?: string;
}

interface OauthModuleOptionsBase {
  controller: ControllerOptions;
  provide: (user: any) => any;
}

/**
 * G O O G L E   I N T E R F A C E S
 */

export interface GoogleServiceOptions extends ServiceOptions {
  scope: string[];
  callbackUrl: string;
  accessType?: string;
  responseType?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
}

export interface GoogleUser {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
  [index: string]: any;
}

interface GoogleOauthModuleOptions extends OauthModuleOptionsBase {
  name: 'google';
  service: GoogleServiceOptions;
  provide: (user: GoogleUser) => any;
}

/**
 * G I T H U B   I N T E R F A C E S
 */

export interface GithubServiceOptions extends ServiceOptions {
  login?: string;
  allowSignup?: boolean;
}

export interface GithubUser {
  access_token: string;
  scope: string;
  token_type: string;
  [index: string]: any;
}

interface GithubOauthModuleOptions extends OauthModuleOptionsBase {
  name: 'github';
  service: GithubServiceOptions;
  provide: (user: GithubUser) => any;
}

/**
 * M O D U L E   O P T I O N S
 */

export type OauthModuleProviderOptions =
  | GoogleOauthModuleOptions
  | GithubOauthModuleOptions;

export interface OauthModuleOptions {
  authorities: OauthModuleProviderOptions[];
  controllerRoot: string;
}

export type OauthProvider = 'google' | 'github';
