import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import TabBar from '../Component/TabBar/TabBar';
//---------- Home
import HomeList from '../Screen/Home/HomeList';
import HomeMap from '../Screen/Home/HomeMap';
import LocationDetail from '../Screen/LocationDetail';
//---------- Search
import HeaderSearch from '../Component/HeaderSearch/HeaderSearch'
import Search from '../Screen/Search/Search';
//-----------CameraAR
import CameraAr from '../Screen/CameraAR/CameraAr.js';
//---------- Favorite
import Favorite from '../Screen/Favorite/Favorite';
//---------- Account
import Authentication from '../Screen/Account/Authentication';
import Profile from '../Screen/Account/Profile';
import Register from '../Screen/Account/Register';
import SignIn from '../Screen/Account/SignIn';
import SignOut from '../Screen/Account/SignOut';
import styles from '../Component/FloatingButton/styles';

export const HomeStack = StackNavigator({
    HomeMap: {
        screen: HomeMap,
        navigationOptions: {
            title: 'Home Map',
            headerTintColor: '#0066ff',
        },
    },
    HomeList: {
        screen: HomeList,
        navigationOptions: {
            title: 'Home List',
            headerTintColor: '#0066ff',
        },
    },
    LocationDetail: {
        screen: LocationDetail,
        navigationOptions: {
            title: 'Location Detail',
            headerTintColor: '#0066ff',
        }
    }
});

export const SearchStack = StackNavigator({
    Search: {
        screen: Search,
        navigationOptions: {
            header: (<HeaderSearch />)
        },
    },
    LocationDetail: {
        screen: LocationDetail,
        navigationOptions: {
            title: 'Location Detail',
            headerTintColor: '#0066ff',
        }
    }
});

export const CameraArStack = StackNavigator({
    CameraAr: {
        screen: CameraAr,
        navigationOptions: {
            header: null
        },
    },
    LocationDetail: {
        screen: LocationDetail,
        navigationOptions: {
            title: 'Location Detail',
            headerTintColor: '#0066ff',
        }
    }
});

export const FavoriteStack = StackNavigator({
    Favorite: {
        screen: Favorite,
        navigationOptions: {
            title: 'Favorite',
            headerTintColor: '#0066ff',
        },
    },
    LocationDetail: {
        screen: LocationDetail,
        navigationOptions: {
            title: 'Location Detail',
            headerTintColor: '#0066ff',
        }
    }
});

export const AccountStack = StackNavigator({
    Authentication: {
        screen: Authentication,
        navigationOptions: {
            title: 'Authentication',
            headerTintColor: '#0066ff',
        },
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: 'Sign In',
            headerTintColor: '#0066ff',
        },
    },
    SignOut: {
        screen: SignOut,
        navigationOptions: {
            title: 'Sign Up',
            headerTintColor: '#0066ff',
        },
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            title: 'Profile',
            headerTintColor: '#0066ff',
        },
    }
});

export const HomeScreenRouter = TabNavigator(
    {
        Home: { screen: HomeStack, },
        Searchs: { screen: SearchStack },
        CameraArs: { screen: CameraArStack },
        Favorites: { screen: FavoriteStack },
        Account: { screen: AccountStack }
    },
    {
        tabBarPosition: "bottom",
        swipeEnabled: false,
        tabBarComponent: props => {
            return (
                <TabBar {...props} />
            );
        }
    }
);
export default HomeScreenRouter;