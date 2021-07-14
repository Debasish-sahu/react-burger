import React, { useState, useEffect } from 'react';
import Input from '../../components/UI/Forms/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/action/index';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = props => {

    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your Mail Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true,
                status: false,
                touched: false
            }
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6,
                status: false,
                touched: false
            }
        }
    });
    const [isSignUp, setIsSignUp] = useState(true);

    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props

    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);


    const inputChangedHnadler = (event, controlName) => {
        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm[controlName], {
                value: event.target.value,
                validation: updateObject(authForm[controlName].validation, {
                    status: checkValidity(event.target.value, authForm[controlName].validation),
                    touched: true
                })
            })
        });
        setAuthForm(updatedControls);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
    }

    const switchAuthModeHandler = () => {
        setIsSignUp(!isSignUp);
    }


    const formElemenetsArray = [];
    for (let key in authForm) {
        formElemenetsArray.push({
            id: key,
            config: authForm[key]
        });
    }

    let form = formElemenetsArray.map(formElement => (
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
    ));

    if (props.loading) {
        form = <Spinner />
    }

    let errorMessage = null;

    if (props.error) {
        errorMessage = (
            <p>{props.error.message}</p>
        );
    }

    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />
    }

    return (
        <React.Fragment>
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button
                    clicked={switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        </React.Fragment>
    )

}

const mapDispatchToProps = dispath => {
    return {
        onAuth: (email, password, isSignUp) => {
            dispath(actions.auth(email, password, isSignUp))
        },
        onSetAuthRedirectPath: () => {
            dispath(actions.setAuthRedirectPath('/'))
        }
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirect
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);