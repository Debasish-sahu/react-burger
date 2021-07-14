import axios from '../../axios-orders';
import { put } from 'redux-saga/effects';
import * as actions from '../action/index';

export function* purchageBurgerSaga(action) {
    yield put(actions.purchaseBurgerStart());
    var response = yield axios.post('/orders.json?auth=' + action.token, action.orderData)
    try {
        yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData));
    }
    catch (error) {
        yield put(actions.purchaseBurgerFail(error));
    }
}

export function* fetchOrdersSaga(action) {
    yield put(actions.fetchOrderStart());
    const queryParams = '?auth=' + action.token + '&orderBy="userId"&equalTo="' + action.userId + '"';
    try {
        var response = yield axios.get('/orders.json' + queryParams);
        const fetchedOrders = [];
        for (let key in response.data) {
            fetchedOrders.push({ ...response.data[key], id: key });
        }
        yield put(actions.fetchrdersSuccess(fetchedOrders));
    }
    catch (error) {
        yield put(actions.fetchOrdersFail(error));
    };
}