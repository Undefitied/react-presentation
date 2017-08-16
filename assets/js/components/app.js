import React, { Component } from 'react';
import Navbar from './navbar';
import Footer from './footer';

import { getContent } from '../actions/contentful';

class App extends Component {
    static fetchData({ store }) {
        const gettingContent = store.dispatch(getContent());
        return Promise.all([gettingContent]);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            // console.log('page change:', nextProps.location.pathname);
        }
    }
    render() {
        const isHomePage = this.props.location.pathname === '/';

        return (
            <div className="app">
                <Navbar location={this.props.location.pathname} isHomePage={isHomePage} />
                    {this.props.children}
                <Footer />
            </div>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.node,
    location: React.PropTypes.object
};

export default App;
