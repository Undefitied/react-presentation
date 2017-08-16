import React, { Component, PropTypes } from 'react';
import Positions from '../components/positions';
import Hero from '../components/hero';
import Page from '../components/page';
import Content from '../components/content';
import { connect } from 'react-redux';
import { setTitle, setDescription } from '../actions/meta';



class Career extends Component {

   componentWillMount() {
        this.props.dispatch(setTitle(this.props.data.metaTitle));
        this.props.dispatch(setDescription(this.props.data.metaDescription));
   }

   render(){
       const data = this.props.data;
       const heroData = {
           img: data.heroImage.fields.file.url,
           title: data.heroTitle,
           subtitle: data.heroSubtitle,
           heroBackgroundColor: data.heroBackgroundColor
       };

       return (
           <Page key={data.url} className="enveloped">
               <Hero data={heroData} />
               <Content components={data.components} />
               <Positions />
           </Page>
       );
   }
};

export default connect(function(state) {
    const { pages } = state.cful;
    return {
        data: pages.filter((page) => page.fields.pageType === 'career')[0].fields
    };
})(Career);
