import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

const transparent = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const sizeMappings = {
    third: '33vw',
    half: '50vw',
    full: '100vw'
};

class Image extends Component {
    constructor() {
        super(...arguments);
        this.imageLoaded = this.imageLoaded.bind(this);
        this.state = {
            loaded: false
        };
        this.isIE = this.props.ua === 'ie';
    }
    componentDidMount() {
        if (this.isIE) {
            this.imageLoaded();
        } else {
            if (this.refs.image.complete && this.refs.image.naturalWidth) {
                this.imageLoaded();
            }
        }
    }
    imageLoaded() {
        if (this.props.onLoad) {
            this.props.onLoad();
        }
        this.setState({
            loaded: true
        });
    }
    render() {
        // const baseUrl = `https://unsplash.it/W/H?image=${this.props.id}`;

        const classes = cx({
            loaded: this.state.loaded
        });
        const holderClasses = cx('adaptive', this.props.className);

        if (this.isIE) {
            return (
                <figure className={holderClasses} id={this.props.id}>
                    <div
                        className="img loaded"
                        style={{
                            backgroundImage: `url(${this.props.src}?w=1366&q=66)`,
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat'
                        }} />
                </figure>
            );
        }

        const baseUrl = `${this.props.src}?w=_W_&q=_Q_`;
        const sizes = this.props.sizes || sizeMappings.full;

        const resMappings = [{
            size: '320w',
            width: 480
        }, {
            size: '360w',
            width: 720
        }, {
            size: '599w',
            width: 800
        }, {
            size: '768w',
            width: 800
        }, {
            size: '1024w',
            width: 1280
        }, {
            size: '1160w',
            width: 1366
        }, {
            size: '1366w',
            width: 1440
        }, {
            size: '1920w',
            width: 2048
        }, {
            size: '2560w',
            width: 2560
        }];

        const srcset = resMappings.map(function(d) {
            // const url = `//placehold.it/_W_?hash=${baseUrl}`.replace(/_W_/g, d.width);
            const url = baseUrl.replace('_W_', d.width).replace('_Q_', 66);
            return `${url} ${d.size}`;
        });

        srcset.unshift(`${transparent} 1w`);
        return (
            <figure className={holderClasses} id={this.props.id}>
                <img
                    className={classes}
                    ref="image"
                    onLoad={this.imageLoaded}
                    sizes={sizes}
                    src={transparent}
                    srcSet={srcset.join(',')}
                    role="presentation"
                    />
            </figure>
        );
    }
}

Image.propTypes = {
    id: PropTypes.string,
    src: PropTypes.string.isRequired,
    sizes: PropTypes.string,
    className: PropTypes.string,
    ua: PropTypes.string.isRequired,
    onLoad: PropTypes.func
};

export default connect(function(state) {
    const ua = state.ua.agent;
    return {
        ua
    };
})(Image);
