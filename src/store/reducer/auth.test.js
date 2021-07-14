import reducer from './auth';
import * as actionTypes from '../action/actionTypes';

describe('auth reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirect: '/'
        });
    });

    it('shuld store the token upon login', () => {
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirect: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'testIdToken',
            userId: 'testUserId'
        })).toEqual({
            token: 'testIdToken',
            userId: 'testUserId',
            error: null,
            loading: false,
            authRedirect: '/'
        })
    })
});