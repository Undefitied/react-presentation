import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Page from '../components/page';
import Hero from '../components/mobile-hero';
import Slides from '../components/slide-video';
import { changeBgVisibility } from '../actions/navbar';
import { setTitle, setDescription } from '../actions/meta';
import Content from '../components/content';
import cx from 'classnames';

class Home extends Component {
    constructor() {
        super(...arguments);
        this.onTimeline = this.onTimeline.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.state = {
            timeline: 0,
            forcePosition: null
        };
    }
    componentWillMount() {
        if (this.props.agent !== 'touch') {
            this.props.dispatch(changeBgVisibility(false));
        } else if (this.props.agent === 'touch') {
            this.props.dispatch(changeBgVisibility('home'));
        } else {
            this.props.dispatch(changeBgVisibility(false));
        }
        this.props.dispatch(setTitle(this.props.data.metaTitle));
        this.props.dispatch(setDescription(this.props.data.metaDescription));
    }
    componentWillUnmount() {
        this.props.dispatch(changeBgVisibility(true));
    }
    onTimeline(timeline) {
        if (timeline !== this.state.timeline) {
            this.setState({
                timeline
            }, () => {
                setTimeout(function() {
                    try {
                        window.dispatchEvent(new Event('scroll'));
                    } catch(e) {}
                }, 700);
            });
        }
    }
    handleBackClick() {
        this.setState({
            forcePosition: 0
        }, () => {
            this.setState({
                forcePosition: null
            });
        });
    }
    render() {
        const isTouch = this.props.agent === 'touch';
        const data = this.props.data;
        const heroData = {
            img: data.heroImage.fields.file.url,
            title: data.heroTitle,
            subtitle: data.heroSubtitle
        };
        const yShift = isTouch ? '0' : 100 - this.state.timeline <= 0 ? '4rem' : '100%';
        const contentStyle = {
            transition: 'transform 700ms ease-in-out',
            transform: `translate3d(0,${yShift},0)`
        };

        let comp = null;

        if (isTouch) {
            comp = <Hero backgroundVisible={this.props.backgroundVisible} dispatch={this.props.dispatch} data={heroData} />;
        } else {
            comp = (
                <Slides
                    forcePosition={this.state.forcePosition}
                    onTimeline={this.onTimeline}
                    heroData={heroData}
                    backgroundVisible={this.props.backgroundVisible}
                    dispatch={this.props.dispatch} />
            );
        }

        return (
            <div>
                <Page className="full-bleed" key="123">
                    {comp}
                    <Content components={data.components} style={contentStyle}>
                        {!isTouch && <div onClick={this.handleBackClick} className={cx('chevron skip-back', {
                            animate: this.state.timeline >= 100
                        })} />}
                    </Content>
                </Page>
            </div>
        );
    }
}

Home.propTypes = {
    data: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect(function(state) {
    const { pages } = state.cful;
    const { agent } = state.ua;
    const backgroundVisible = state.navbar.backgroundVisible;

    const data = pages.filter((page) => {
        return page.fields.pageType === 'homepage';
    })[0].fields;

    return { data, backgroundVisible, agent };
})(Home);
