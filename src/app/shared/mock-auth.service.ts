import {Injectable} from '@angular/core';
@Injectable()
export class MockAuthenticationService {
    getToken(): string {
        let token: string = process.env['STACK_API_TOKEN'];
        return token;
    }

    // Should be removed once the flow for Search API is proper in Production env
    getStageToken(): string {
        let token: string = process.env['SEARCH_API_TOKEN'];
        return token;
    }
}
