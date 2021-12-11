import React from 'react';

export default class Highlight extends React.Component {
    render() {
        const {
            word,
            query
        } = this.props;

        const q = `(${query})`;

        const newReg = new RegExp(q || '', 'gi');
        const wordSplitToParts = word.split(newReg).filter(Boolean);

        const children = wordSplitToParts.map((singleElemnt, key) => {
            if (singleElemnt.toLowerCase() === query.toLowerCase()) {
                return <b key={key}>{singleElemnt}</b>;
            }
            return singleElemnt;
        });
        return (
            <>
                {children}
            </>
        )
    }
}

export const MemoizedHighlight = React.memo(Highlight);