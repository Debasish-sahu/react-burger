import React from 'react';
import { withRouter } from 'react-router-dom';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let ingrediantList = Object.keys(props.ingredients).map(igKey => {
        return [...Array(props.ingredients[igKey])].map((_, i) => {
            return <BurgerIngredient type={igKey} key={igKey + i} />;
        });
    }).reduce((arr, el) => {
        return arr.concat(el)
    }, []);

    if (ingrediantList.length === 0) {
        ingrediantList = <p>Please start adding ingredients!!!</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
            {ingrediantList}
            <BurgerIngredient type='bread-bottom' />
        </div>
    );
}

export default withRouter(burger);