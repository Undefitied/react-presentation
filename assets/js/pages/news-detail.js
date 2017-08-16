import React, { Component, PropTypes } from 'react';
import Column from '../components/column';
import Hero from '../components/hero';
import Page from '../components/page';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Content from '../components/content';
import { setTitle, setDescription } from '../actions/meta';
import { getNewsItem } from '../actions/contentful';

class NewsDetail extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            mounted: false,
            loading: false
        };
    }
    static fetchData({ params, store }) {
        const gettingContent = NewsDetail.loadItem(store.dispatch, params.id);
        return Promise.all([gettingContent]);
    }
    static loadItem(dispatch, id) {
        return dispatch(getNewsItem(id));
    }
    componentWillMount() {
        if (this.props.displayNewsItem === null) {
            this.setState({
                loading: true
            });
            NewsDetail.loadItem(this.props.dispatch, this.props.params.id)
                .then(() => {
                    this.finalise(this.props.displayNewsItem.fields);
                })
                .finally(() => {
                    this.setState({
                        loading: false
                    });
                });
        } else {
            const newsItem = this.props.displayNewsItem.fields;
            this.finalise(newsItem);
        }
    }
    componentDidMount() {
        this.setState({
            mounted: true
        });
    }
    finalise(newsItem) {
        this.props.dispatch(setTitle(newsItem.title));
        this.props.dispatch(setDescription(newsItem.summary));
    }
    componentWillUnmount() {
        this.props.dispatch(getNewsItem(null));
    }
    render() {
        const isLoading = this.state.loading;

        if (isLoading) {
            return (
                <Page className="enveloped news-detail">
                    <Column>
                        <h1>Loading article...</h1>
                    </Column>
                </Page>
            );
        }

        const newsItem = this.props.displayNewsItem.fields;
        const url = this.state.mounted ? window.location.href : 'https://innovationhub.innogy.com';
        const heroData = {
            img: newsItem.image.fields.file.url
        };

        return (
            <Page className="enveloped news-detail">
                <Hero data={heroData}>
                    <Link className="news-back" to="/news-event">Back to News</Link>
                </Hero>
                <Column style={{
                    marginBottom: 0
                }}>
                    {newsItem.title && <h1>{newsItem.title}</h1>}
                </Column>
                {newsItem.components && <Content components={newsItem.components} />}
                <Column className="news-footer">
                    <div className="fifty social no-pad">
                        <a
                            className="facebook"
                            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                            target="_blank">Facebook</a>
                        <a
                            className="twitter"
                            href={`https://twitter.com/intent/tweet?text=${encodeURI(`'${newsItem.title}'`)}%20on%20${url}&hashtags=innogy&via=innogy_en`}>Twitter</a>
                    </div>
                    <div className="fifty no-pad">
                        <Link className="news-back" to="/news-event">Back to News</Link>
                    </div>
                </Column>
            </Page>
        );
    }
}

NewsDetail.propTypes = {
    displayNewsItem: PropTypes.object,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(function(state) {
    const { displayNewsItem } = state.cful;
    return { displayNewsItem };
})(NewsDetail);
