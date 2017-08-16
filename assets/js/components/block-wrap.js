import React from 'react';

const BlockWrap = (props) => {
    return (
        <div {...props}>{props.children}</div>
    );
};

export default BlockWrap;
