import React from 'react';
import Button from '../../UI/Button/Button';

const OrderSummary = props => {

    const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
        return (
            <li key={igKey}>
                <span style={{ textTransform: 'capitalize' }}>{igKey}</span> : {props.ingredients[igKey]}
            </li>
        );
    });
    return (
        <React.Fragment>
            <h3>Your Order</h3>
            <p>Your delicious burger is getting ready with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price : {props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout?</p>
            <Button clicked={props.purchaseCanceled} btnType="Danger">CANCEL</Button>
            <Button clicked={props.purchaseContinued} btnType="Success">CONTINUE</Button>
        </React.Fragment>
    )

};

export default OrderSummary;