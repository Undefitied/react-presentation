import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Page templates
import Plain from './templates/plain';
import FullBleed from './templates/full-bleed';
import Enveloped from './templates/enveloped';
import { setTitle, setDescription } from '../actions/meta';


class GenericPage extends Component {
    componentWillMount() {
        const data = this.props.pages.filter((page) => page.fields.url === this.props.route.path)[0].fields;
        this.props.dispatch(setTitle(data.metaTitle));
        this.props.dispatch(setDescription(data.metaDescription));
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.route.path !== this.props.route.path) {
            const data = nextProps.pages.filter((page) => page.fields.url === nextProps.route.path)[0].fields;
            this.props.dispatch(setTitle(data.metaTitle));
            this.props.dispatch(setDescription(data.metaDescription));
        }
    }
    render() {
        const data = this.props.pages.filter((page) => page.fields.url === this.props.route.path)[0].fields;

        let Template;
        switch (data.pageTemplate) {
            case 'plain':
                Template = Plain;
                break;
            case 'full-bleed':
                Template = FullBleed;
                break;
            case 'enveloped':
                Template = Enveloped;
                break;
            default:
                throw new Error(`unknown Page template: ${data.pageTemplate}`);

        }

        return (
            <Template data={data} />
        );
    }
}

GenericPage.propTypes = {
    pages: PropTypes.array,
    route: PropTypes.object
};

export default connect(function(state) {
    const { pages } = state.cful;
    return {
        pages
    };
})(GenericPage);
