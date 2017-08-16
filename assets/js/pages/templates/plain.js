import React, { Component, PropTypes } from 'react';
import Page from '../../components/page';
import Content from '../../components/content';

class PlainTemplate extends Component {
    render() {
        const data = this.props.data;

        return (
            <Page className="plain">
                <Content components={data.components || []} />
            </Page>
        );
    }
}

export default PlainTemplate;
