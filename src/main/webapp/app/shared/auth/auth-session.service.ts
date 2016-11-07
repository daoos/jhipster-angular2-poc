import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService } from 'ng2-webstorage';


@Injectable()
export class AuthServerProvider {

    constructor(
        private http: Http,
        private $localStorage: LocalStorageService

    ){}

    getToken () {
        return this.$localStorage.retrieve('authenticationToken');
    }

    hasValidToken () {
        return !!this.getToken();
    }

    login (credentials): Observable<any> {
        let data = 'j_username=' + encodeURIComponent(credentials.username) +
            '&j_password=' + encodeURIComponent(credentials.password) +
            '&remember-me=' + credentials.rememberMe + '&submit=Login';
        let headers = new Headers ({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post('api/authentication', data, {
            headers: headers
        });
    }

    logout (): Observable<any> {
        // logout from the server
        return this.http.post('api/logout', {}).map((response: Response) => {

            this.$localStorage.clear('authenticationToken');
            // to get a new csrf token call the api
            this.http.get('api/account').subscribe(() => {}, () => {});
            return response;
        });
    }
}