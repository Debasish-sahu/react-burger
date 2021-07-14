import React, { useState, useEffect, useCallback } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'
import wirhErrorHandler from '../hoc/withErrorHandler/withErrorHandler'
import { connect, useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/action/index';


const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => 
        state.burgerBuilder.ingredients
    );

    const price = useSelector(state => 
        state.burgerBuilder.totalPrice
    );

    const error = useSelector(state => 
        state.burgerBuilder.error
    );

    const isAuthenticated = useSelector(state => 
        state.auth.token !== null
    );

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onIntiIngredients = useCallback(() => dispatch(actions.initIngredients()),[dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
        onIntiIngredients();
    }, [onIntiIngredients]);


    const updatePurchaseState = ingrediantList => {
        const ingrediantSum = Object.keys(ingrediantList).map(igKey => {
            return ingrediantList[igKey]
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        return ingrediantSum > 0;
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = { ...this.state.ingredients };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0)
    //         return;
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = { ...this.state.ingredients };
    //     updatedIngredients[type] = updatedCount;
    //     const priceSubstraction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceSubstraction;
    //     this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    //     this.updatePurchaseState(updatedIngredients);
    // }

    const orderHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const orderCancelHandler = () => {
        setPurchasing(false);
    }

    const orderContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }


    const disabledInfo = {
        ...ings
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    let burger = error ? <p>ingrediants can't be loaded</p> : <Spinner />
    if (ings) {
        burger = (
            <React.Fragment>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    price={price}
                    purchasableStatus={updatePurchaseState(ings)}
                    disabled={disabledInfo}
                    purchasing={orderHandler}
                    isAuth={isAuthenticated} />
            </React.Fragment>
        );
        orderSummary = <OrderSummary
            ingredients={ings}
            purchaseCanceled={orderCancelHandler}
            purchaseContinued={orderContinueHandler}
            price={price} />
    }


    return (
        <React.Fragment>

            <Modal show={purchasing} modalClose={orderCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </React.Fragment>
    );

}

export default wirhErrorHandler(BurgerBuilder, axios);