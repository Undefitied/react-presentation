import React, { Component, PropTypes } from 'react';
import Page from '../../components/page';
import Hero from '../../components/hero';
import Content from '../../components/content';

class Enveloped extends Component {
    render() {
        const data = this.props.data;
        const heroData = {
            img: data.heroImage.fields.file.url,
            title: data.heroTitle,
            subtitle: data.heroSubtitle,
            heroBackgroundColor: data.heroBackgroundColor
        };

        return (
            <Page className="enveloped" key={heroData.title + data.components.length}>
                <Hero data={heroData} />
                <Content components={data.components} />
            </Page>
        );
    }
}

Enveloped.propTypes = {
    data: PropTypes.object.isRequired
};

export default Enveloped;
