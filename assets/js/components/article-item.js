import React, { Component } from 'react';
import Markdown from 'react-rich-markdown';
import { polyfill } from 'es6-object-assign';
polyfill();

export default class ArticleItem extends Component {
    constructor() {
        super();
    }

    render() {
        const data = this.props.data;
        return (
            <div className="article-item">
                <h2 className="headline heading">{data.title}</h2>
                {data.description && <Markdown source={data.description}/>}
            </div>
        );
    }
};

