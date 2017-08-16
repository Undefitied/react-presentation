import React, { Component, PropTypes } from 'react';
import Page from '../components/page';
import Content from '../components/content';
import { connect } from 'react-redux';
import { setTitle, setDescription } from '../actions/meta';



class Iprize extends Component {

    componentWillMount() {
        this.props.dispatch(setTitle(this.props.data.metaTitle));
        this.props.dispatch(setDescription(this.props.data.metaDescription));
    }

   render(){
       const data = this.props.data;

       return (
           <Page key={data.url} className="iprize">
               <Content components={data.components} />
               <div className="column">
                   <div className="partner">
                       <h2 className="title">Partner</h2>
                       <a href="http://gtec.berlin/">
                           <img className="logo" src="./img/bitmap.jpg" alt="logotype"/>
                       </a>
                       <a href="https://twitter.com/search?l=&q=%23iprize" target="_blank" className="link-block">#iprize</a>
                   </div>
               </div>
           </Page>
       );
   }
};

export default connect(function(state) {
    const { pages } = state.cful;
    return {
        data: pages.filter((page) => page.fields.pageType === 'iprize')[0].fields
    };
})(Iprize);
