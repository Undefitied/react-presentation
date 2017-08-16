import React, { Component, PropTypes } from 'react';
import getId from 'get-youtube-id';
import Markdown from 'react-rich-markdown';
import { polyfill } from 'es6-object-assign';
polyfill();
import Column from './column';

class Article extends Component {
    renderVideo(ytId) {
        return (
            <div className="pad">
                <iframe
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    rel="0"
                    type="text/html"
                    allowFullScreen
                    src={`https://www.youtube.com/embed/${ytId}`}
                    frameBorder="0" />
            </div>
        );
    }

    render() {
        const headline = this.props.data.headline;
        const subhead = this.props.data.subhead;
        const body = this.props.data.body;
        const videoURL = this.props.data.videoURL;
        const ytId = getId(videoURL);
        const videoIsTop = this.props.data.videoPosition;
        const hasHead = (headline || subhead);
        return (
            <Column className="article">
                {headline && <h1>{headline}</h1>}
                {subhead && <h2>{subhead}</h2>}
                {ytId && videoIsTop && this.renderVideo(ytId)}
                {body && <Markdown className="article" source={body}/>}
                {ytId && !videoIsTop && this.renderVideo(ytId)}
            </Column>
        );
    }
}

Article.propTypes = {
    data: PropTypes.object.isRequired
};

export default Article;
