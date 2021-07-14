import React, { useState } from 'react';
import classes from './Layout.module.css'
import Toolbar from '../../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../../components/Navigation/SideDrawer/SideDrawer'
import { connect } from 'react-redux';

const Layout = props => {

    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);


    const sideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false);
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    }

    return (
        <React.Fragment>
            <Toolbar
                isAuth={props.isAuthenticated}
                sideDrawerToggle={sideDrawerToggleHandler} />
            <SideDrawer
                isAuth={props.isAuthenticated}
                open={sideDrawerIsVisible} closed={sideDrawerToggleHandler} />
            <div>Toolbar, Side Drawer, Backdrop</div>
            <main className={classes.Content}>
                {props.children}
            </main>
        </React.Fragment>
    )

}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);