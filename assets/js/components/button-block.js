import React from 'react';
import Column from './column';
import Markdown from 'react-rich-markdown';
import cx from 'classnames';

const ButtonBlock = (props) => {
    const data = props.data;
    const buttonLabel = data.buttonLabel;
    const buttonLink = data.buttonLink;
    const alignCenter = data.alignCenter;
    const description = data.description;
    const extraPadding = data.paddingBottom;

    const classes = cx('button-block', {'text-center': alignCenter}, {'extra-padding': extraPadding});

    return (
        <Column className={classes}>
            {description && <Markdown source={description}/>}
            <a href={buttonLink} className="button">{buttonLabel}</a>
        </Column>
    );
};

export default ButtonBlock;
