import React from 'react';
import Markdown from 'react-rich-markdown';
import { polyfill } from 'es6-object-assign';
polyfill();
import cx from 'classnames';

const Card = (props) => {
    const fields = props.card.fields;
    const styles = fields.image ? { backgroundImage: `url(${fields.image.fields.file.url})`}: {};
    const title = fields.title;
    const nonImageType = fields.nonImageType;
    const description = fields.description;
    const additionalTitle = fields.additionalTitle;
    const additionalDescription = fields.additionalDescription;

    return(
        <div className={cx('card', 'swiper-slide', {'image-type' : !nonImageType})}>
            <div style={styles} className={cx('media', fields.backgroundColor)}>
                {nonImageType && additionalTitle && <p className="additional-title">{additionalTitle}</p>}
            </div>
            <div className={cx('content', fields.backgroundColor)}>
                {!nonImageType && title && <p className="description front">{title}</p>}
                {description && <div className="description back"><Markdown source={description} /></div>}
                {nonImageType && additionalDescription && <p className="description addition-description">{additionalDescription}</p>}
            </div>
        </div>
    )
};

export default Card;
