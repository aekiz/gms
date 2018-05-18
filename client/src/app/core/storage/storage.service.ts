import { Injectable } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { tap } from 'rxjs/internal/operators';
import { BehaviorSubject, Observable, of } from 'rxjs/index';
import deleteProperty = Reflect.deleteProperty;

/**
 * A service for providing access to the storage and cookies in client runner (browser, etc).
 */
@Injectable()
export class StorageService {

  /**
   * Prefix for all keys used for storing values (either in cookies or in localStorage)
   * @type {string}
   */
  pre = 'gms_ck_';

  /**
   * Object which holds the stored values.
   * @type {{}}
   */
  private cache = {};

  /**
   * Observables of StorageService#cache
   * @type {{}}
   */
  private cache$ = {};

  /**
   * Object for storing how many times StorageService#trySet function have been trying to save a particular value.
   * @type {}
   */
  private trySetCount = {};

  /**
   * Object for storing how many times StorageService#tryClear function have been trying to clear a particular value.
   * @type {}
   */
  private tryClearCount = {};

  /**
   * Service constructor.
   * @param {CookieService} cookieService CookieService for storing values in cookies.
   * @param {LocalStorage} localStorage LocalStorage for storing values in the browser local storage.
   */
  constructor(private cookieService: CookieService, private localStorage: LocalStorage) { }

  // region local storage
  /**
   * Sets a new value under a key in the localStorage.
   * @param {string} key String representation of the key under which the value will be stored.
   * @param value Value to be stored
   * @returns {any}
   */
  set(key: string, value: any): any {
    this.checkKey(key);
    this.setCache(key, value);
    this.trySetCount[key] = 0;
    this.trySet(key, value);
    return value;
  }

  /**
   * Tries to save a value under a key in the client local storage. If the method fails it will retry 3 times more to save it.
   * @param {string} key String representation of the key under which the value will be stored.
   * @param value Value to be stored
   */
  private trySet(key: string, value: any) {
    this.localStorage.setItem(key, value).subscribe(() => {}, () => {
      if (this.trySetCount[key]++ < 2) {
        this.trySet(key, value);
      } else {
        console.warn('Couldn\'t set ' + value + ' under key \'' + key + '\'');
      }
    });
  }

  /**
   * Returns an observable which will emit the value specified under a key.
   * @param {string} key Key under which the value it's being tried to be accessed was saved previously.
   * @returns {Observable<any>} An obervable with the saved value under the specified key or `null` if no value is found under the specified
   * key.
   */
  get(key: string): Observable<any> {
    this.checkKey(key);
    const value$ = this.cache$[this.pre + key];
    return value$ ? value$ : this.localStorage.getItem(key).pipe(tap((val) => this.setCache(key, val)));
  }

  /**
   * Creates the cache value and the cache observable.
   * @param key Key for looking up.
   * @param val Value to be looked up.
   */
  private setCache(key, val) {
    const subject = this.cache[this.pre + key];
    if (!subject) {
      this.cache[this.pre + key] = new BehaviorSubject(this.cache[this.pre + key]);
      this.cache$[this.pre + key] = this.cache[this.pre + key].asObservable();
    } else {
      this.cache[this.pre + key].next(val);
    }
  }

  /**
   * Sets all values in cache to null.
   */
  private clearCache() {
    for (const k in this.cache) {
      if (this.cache.hasOwnProperty(k)) {
        this.cache[k].next(null);
      }
    }
  }

  /**
   * Clears a value under a key or all values if no key is specified. This function uses the StorageService#get function in order to return
   * the value.
   * @param {string} key Key under the value is being tried to be removed was saved previously. If no key is provided all values are removed
   * .
   * @returns {any} If a key is provided, the value that was saved under that key is returned wrapped inside an Observable or `null` (also
   * wrapped inside an Observable) if no key is provided.
   */
  clear(key?: string): Observable<any> {
    return this.tryClear(key);
  }

  /**
   * Tries to clear a value under a key or all values if no key is specified. This function uses the StorageService#get function in order to
   * return the value. If the method fails it will retry 3 times more to clear the value.
   * @param {string} key
   * @returns {Observable<any>}
   */
  private tryClear(key?: string): Observable<any> {
    const value$ = this.get(key);
    // clear a specific value
    if (typeof key !== 'undefined' && typeof key !== null) {
      return this.localStorage.removeItem(this.pre + key).pipe(tap( () => {
        // delete property in cache, this will trigger the next value of the observable in this.cache$[this.pre + key]
        deleteProperty(this.cache, this.pre + key);
        return value$;
      }, () => {
        if (this.tryClear()[key]++ < 2) {
          this.tryClear(key);
        }
      }));
    } else { // clear all
      return this.localStorage.clear().pipe(tap(() => {
        this.clearCache();
        return of(null);
      }, () => {
        if (this.tryClear()[key]++ < 2) {
          this.tryClear(key);
        }
      }));
    }
  }
  // endregion

  // region cookies
  /**
   * Puts a new value under a key in a cookie.
   * @param {string} key String representation of the key under which the value will be stored.
   * @param value Value to be stored.
   * @param {object} options Additional options for cookies.
   * @param {object} options Additional options to be passes. i.e.: if it is a cookie the 'expires' option can be set like this:
   * <pre><code>{expires: <value> {string|Date}</code></pre>
   * @returns {any}
   */
  putCookie(key: string, value: any, options?: object): any {
    this.checkKey(key);
    this.setCache(key, value);
    typeof value === 'object' ? this.cookieService.putObject(this.pre + key, value, options as CookieOptions)
      : this.cookieService.put(this.pre + key, value);
    return value;
  }

  /**
   * Gets a cookie value (or all values if no key is provided) specified under a key stored in cookie.
   * @param {string} key Key under which the value it's being tried to be accessed was saved previously. If not key is provided or a falsy
   * value, this returns all cookies.
   * @param {boolean} isObject Whether the value is trying to be retrieved is an object or not.
   * @returns {Observable<any>} An Observable with the saved value under the specified key (or all values if no key is provided) or `null`
   * if no value is found under the
   * specified key.
   */
  getCookie(key?: string, isObject = false): Observable<any> {
    if (key) {
      let value$ = this.cache$[this.pre + key];
      if (!value$) {
        const val = isObject ? this.cookieService.getObject(this.pre + key) : this.cookieService.get(this.pre + key);
        this.setCache(key, val);
      }
      value$ = this.cache$[this.pre + key];
      return value$ ? value$ : of(null);
    } else {
      return of(this.cookieService.getAll());
    }
  }

  /**
   * Clears a value under a key or all values if no key is specified or its value is falsy. This function uses the StorageService#getCookie
   * function in order to return the value.
   * @param {string} key Key under the value is being tried to be removed was saved previously. If no key is provided all values are removed
   * .
   * @param {boolean} isObject Whether the value is being tried to be cleared is an object or not. If no key is provided, then this can not
   * be provided.
   * @returns {any} If a key is provided, the value that was saved under that key is returned.
   */
  clearCookie(key?: string, isObject = false): Observable<any> {
    if (key) {
      return this.getCookie(key, isObject).pipe(tap(() => {
        deleteProperty(this.cache, this.pre + key);
        this.cookieService.remove(this.pre + key);
      }));
    } else {
      this.clearCache();
      this.cookieService.removeAll();
    }
  }
  // endregion

  /**
   * Checks whether a given key is valid or not. This throws an error if the given key is invalid.
   * @param {string} key
   */
  private checkKey(key: string) {
    if (typeof key === 'undefined' || key === null) {
      throw new Error('The key must be defined');
    }
  }
}
