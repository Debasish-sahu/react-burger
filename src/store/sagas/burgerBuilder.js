import axios from '../../axios-orders';
import { put } from 'redux-saga/effects';
import * as actions from '../action/index';

export function* initIngredientsSaga(action) {
    try {
        const response = yield axios.get('https://react-burger-builder-4689c.firebaseio.com/ingredients.json')
        yield put(actions.setIngredients(response.data));
    } catch (error) {
        yield put(actions.fetchInfredientsFailed())
    }
}