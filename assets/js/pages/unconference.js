import React, { Component, PropTypes } from 'react';
import Page from '../components/page';
import Content from '../components/content';
import { connect } from 'react-redux';
import { setTitle, setDescription } from '../actions/meta';



class Unconference extends Component {

    componentWillMount() {
        this.props.dispatch(setTitle(this.props.data.metaTitle));
        this.props.dispatch(setDescription(this.props.data.metaDescription));
    }

   render(){
       const data = this.props.data;

       return (
           <Page key={data.url} className="unconference">
               <Content components={data.components} />
           </Page>
       );
   }
};

export default connect(function(state) {
    const { pages } = state.cful;
    return {
        data: pages.filter((page) => page.fields.pageType === 'unconference')[0].fields
    };
})(Unconference);
