import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { SessionService } from '../session/session.service';

/**
 * Interceptor for setting on every request made the authorization header if the user has being logged in previously.
 */
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {

  /**
   * Interceptor constructor.
   * @param {SessionService} sessionService
   */
  constructor(private sessionService: SessionService) { }

  /**
   * Intercepts all request in order to set the Authorization header properly if the user is logged in.
   * @param {HttpRequest<any>} req Request performed.
   * @param {HttpHandler} next Next http handler.
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request;
    if (this.sessionService.isLoggedIn()) {
      const accessToken = this.sessionService.getAccessToken();
      const header = this.sessionService.getHeader();
      const tokenType = this.sessionService.getTokenType();
      const iHeaders = {};
      iHeaders[header as string] = tokenType + ' ' + accessToken;

      request = req.clone({ setHeaders: iHeaders});
    } else {
      request = req;
    }

    return next.handle(request);
  }
}