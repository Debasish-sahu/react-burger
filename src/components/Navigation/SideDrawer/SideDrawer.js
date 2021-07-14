import React from 'react';
import classes from './SideDrawer.module.css';
import Logo from '../../Logo/Logo';
import Navigationitems from '../NavigationItems/NavigationItems';
import BackDrop from '../../UI/Backdrop/Backdrop';

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if(props.open){
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <React.Fragment>
            <BackDrop show={props.open} clicked={props.closed} />
            <div className={attachedClasses.join(' ')} onClick={props.closed}>
                <div className={classes.Logo}>
                    <Logo className={classes.LogoWidth} />
                </div>
                <nav>
                    <Navigationitems isAuthenticated={props.isAuth}/>
                </nav>
            </div>
        </React.Fragment>
    )
}

export default sideDrawer;