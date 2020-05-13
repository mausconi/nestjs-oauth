import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OauthProvider, ServiceOptions } from '../oauth.interface';
import {
  createGoogleLoginUrl,
  createGoogleUserFunction,
} from './google-url.factory';
import { createFacebookLoginUrl } from './facebook-url.factory';
import { createGithubLoginUrl } from './github-url.factory';
import { createLinkedinLoginUrl } from './linkedin-url.factory';

export const serviceLoginFunction = (
  provider: OauthProvider,
  options: ServiceOptions,
): string => {
  let url: string;
  switch (provider) {
    case 'google':
      url = createGoogleLoginUrl(options);
      break;
    case 'facebook':
      url = createFacebookLoginUrl(options);
      break;
    case 'github':
      url = createGithubLoginUrl(options);
      break;
    case 'linkedin':
      url = createLinkedinLoginUrl(options);
      break;
  }
  return url;
};

export const serviceGetUserFunction = (
  provider: OauthProvider,
  options: ServiceOptions,
  service: (user: any) => any,
  http: HttpService,
): any => {
  let urlAndOptions: {
    url: string;
    options: Record<string, any>;
    userUrl: string;
  };
  const func = (code: string) => {
    switch (provider) {
      case 'google':
        urlAndOptions = createGoogleUserFunction(options, code);
        break;
    }
    return http
      .post(urlAndOptions.url, urlAndOptions.options, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        map(res => res.data),
        switchMap(accessData =>
          http.get(urlAndOptions.userUrl, {
            headers: {
              Authorization: `Bearer ${accessData.access_token}`,
            },
          }),
        ),
        map(userData => userData.data),
        switchMap(user => of(service(user))),
      );
  };
  return func;
};