import React, { useState } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Forms/Input/Input';
import { connect } from 'react-redux';
import withErrorHndler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/action/index';
import { updateObject, checkValidity } from '../../../shared/utility';

const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true,
                status: false,
                touched: false
            }
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
            value: '',
            validation: {
                required: true,
                status: false,
                touched: false
            }
        },
        pinCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'ZIP'
            },
            value: '',
            validation: {
                required: true,
                minLength: 5,
                maxLength: 8,
                isNumeric: true,
                status: false,
                touched: false
            }
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            value: '',
            validation: {
                required: true,
                status: false,
                touched: false
            }
        },
        emailID: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your E-Mail'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true,
                status: false,
                touched: false
            }
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'fastest', displayValue: 'Fastest' },
                    { value: 'normal', displayValue: 'Normal' },
                    { value: 'cheapest', displayValue: 'Cheapest' }
                ]
            },
            value: 'fastest',
            validation: {
                required: false,
                status: true
            }
        },
    });
    const [formIsValid, setFormIsValid] = useState(false);


    const orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for (let formIdentifier in orderForm) {
            formData[formIdentifier] = orderForm[formIdentifier].value;
        }
        const order = {
            ingrediants: props.ings,
            price: props.price.toFixed(2),
            orderData: formData,
            userId: props.userId
        }

        props.onOrderBurger(order, props.token);
    }

    const inputChangedHnadler = (event, inputIdentifier) => {
        const updatedFormElement = updateObject(orderForm[inputIdentifier], {
            value: event.target.value,
            validation: updateObject(orderForm[inputIdentifier].validation, {
                status: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
                touched: true
            })
        });
        const updatedForm = updateObject(orderForm, { [inputIdentifier]: updatedFormElement });

        let formIsValid = true;
        for (let inputIdentifiers in updatedForm) {
            formIsValid = updatedForm[inputIdentifiers].validation.status && formIsValid
        }
        setOrderForm(updatedForm);
        setFormIsValid(formIsValid);

    }


    const formElemenetsArray = [];
    for (let key in orderForm) {
        formElemenetsArray.push({
            id: key,
            config: orderForm[key]
        });
    }

    let form = (
        <form onSubmit={orderHandler}>
            {/* <Input elementType="" elementConfig="" value="" inputtype="input" type="text" name="name" placeholder="Your Name" /> */}
            {formElemenetsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    shouldValidate={formElement.config.validation.required}
                    invalid={!formElement.config.validation.status}
                    touched={formElement.config.validation.touched}
                    changed={(event) => inputChangedHnadler(event, formElement.id)}
                    valueType={formElement.config.elementConfig.placeholder} />
            ))}
            <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
        </form>
    );
    if (props.loading) {
        form = <Spinner />;
    }
    return (
        <div className={classes.ContactData}>
            <h4>Enter your contact data</h4>
            {form}
        </div>
    );

}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHndler(ContactData, axios));