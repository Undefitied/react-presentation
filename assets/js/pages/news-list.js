import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Column from '../components/column';
import Page from '../components/page';
import Image from '../components/adaptive-image';
import { connect } from 'react-redux';
import { format } from '../lib/dates';
import animateScroll from '../lib/animate-scroll';
import { setTitle, setDescription } from '../actions/meta';

const ADVANCE_BY = 10;

class NewsListing extends Component {
    constructor() {
        super(...arguments);
        this.renderItem = this.renderItem.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.state = {
            offset: 10
        };
    }

    componentWillMount() {
        const data = this.props.pages.filter((page) => page.fields.url === this.props.route.path)[0].fields;
        this.props.dispatch(setTitle(data.metaTitle));
        this.props.dispatch(setDescription(data.metaDescription));
    }

    loadMore() {
        const newScrollPos = this.loadMoreButton.getBoundingClientRect().top + window.pageYOffset - 22;
        this.setState({
            offset: this.state.offset + ADVANCE_BY
        }, function () {
            animateScroll(newScrollPos);
        });
    }

    renderItem(items, rIdx) {
        const renderedItems = items.map((item, idx) => {
            const data = item.fields;
            const style = {
                animationDelay: `${(rIdx * 10 + idx + ADVANCE_BY - this.state.offset) * 100}ms`
            };

            return (
                <Link style={style} to={`/news-event/${data.id}/${data.urlifiedTitle}`} className="item" key={idx}>
                    <Image
                        sizes="33vw"
                        src={data.image.fields.file.url}/>
                    <div className="description">
                        <span className="date">{format(data.displayDate)}</span>
                        <h2>{data.title.substr(0, 72)}</h2>
                    </div>
                </Link>
            );
        });

        return (
            <div key={rIdx} className="news-block">{renderedItems}</div>
        );
    }

    render() {
        const offset = this.state.offset;
        const hasMore = offset < this.props.news.length;

        const items = this.props.news.slice(0, offset).reduce(function (col, item, idx) {
            if (idx % 10 === 0) {
                col.push([]);
            }
            col[col.length - 1].push(item);
            return col;
        }, []);
        return (
            <Page className="news-list">
                <Column>
                    <h1>News & Events</h1>
                    <div className="items">
                        {items.map(this.renderItem)}
                    </div>
                    {hasMore && <div className="center">
                        <button
                            ref={el => {
                                this.loadMoreButton = el;
                            }}
                            onClick={this.loadMore}
                            className="load-more">Load More
                        </button>
                    </div>}
                </Column>
            </Page>
        );
    }
}

NewsListing.propTypes = {
    news: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired
};

export default connect(function (state) {
    const { news, pages } = state.cful;
    return { news, pages };
})(NewsListing);
