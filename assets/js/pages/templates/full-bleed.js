import React, { Component, PropTypes } from 'react';
import Page from '../../components/page';
import Hero from '../../components/hero';
import Content from '../../components/content';

class FullBleed extends Component {
    render() {
        const data = this.props.data;

        const heroData = {
            img: data.heroImage.fields.file.url,
            title: data.heroTitle,
            subtitle: data.heroSubtitle,
            heroBackgroundColor: data.heroBackgroundColor
        };

        return (
            <Page className="full-bleed">
                <Hero data={heroData} />
                <Content components={data.components} />
            </Page>
        );
    }
}

FullBleed.propTypes = {
    data: PropTypes.object.isRequired
};

export default FullBleed;
