import React, { useState, useRef } from 'react';
import { debounce, matchQuery, autocompleteDefaultStyle, listDefaultStyle } from './utils';
import { MemoizedHighlight } from './Highlight';
import './LightAutocomplete.css';

let cache = new Map();
const MAX_RESULTS = 30;

const LightAutocomplete = ({autocompleteStyle, listStyle, asyncCall, onSubmit, inputToRender}) => {
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const [shouldShowAutocompleteList, setShouldShowAutocompleteList] = useState(false);
    const [query, setQuery] = useState('');
    
    const autocompleteStyleRef = useRef(Object.assign({}, autocompleteDefaultStyle, autocompleteStyle));
    const listStyleRef = useRef(Object.assign({}, listDefaultStyle, listStyle));
    const autocompleteInputRef = useRef(null);
    const autocompleteElmRef = useRef(null);

    const handleOnChange = async (e) => {
        const query = e.target.value;
        let optionsFromServer;

        setQuery(query);

        let res;
        if(cache.has(query)) {
            res = cache.get(query);
        } else {
            try {
                optionsFromServer = await asyncCall();
                res = filterData(optionsFromServer.data, query);
                cache.set(query, res);
            } catch(err) {
                console.log(err);
            }
        }

        const limitedViewResults = res?.slice(0, MAX_RESULTS) || [];
        setFilteredData(limitedViewResults);
        setShouldShowAutocompleteList((res?.length >= 1) && (query?.length >= 1));
    }

    const filterData = (options, query) => {
        let newOptions = options.filter((item) => {
            return matchQuery(item, query);
        });

        return newOptions;
    }

    const handleOnKeyDown = (e) => {
        const KEY_CODE_DOWN = 40;
        const KEY_CODE_UP = 38;
        const KEY_CODE_ENTER = 13;
        const keyDataAttr = e.target.getAttribute('data-key');
        const itemIndex = keyDataAttr >= 0 && keyDataAttr !== null ? keyDataAttr : selectedItemIndex;
        const eventType = e.type;
        const MaxResults = Math.min(filteredData.length, MAX_RESULTS);
        let newItemIndex = selectedItemIndex;

        if(e.keyCode === KEY_CODE_UP) {
            e.preventDefault(); // hack: prevent native behaviour of cursor to jump to the beginning of the word

            if(selectedItemIndex < 0) {
                newItemIndex = MaxResults-1;
            } else {
                newItemIndex = itemIndex-1;
            }

        }

        if(e.keyCode === KEY_CODE_DOWN) {
            e.preventDefault(); // hack: prevent native behaviour of cursor to jump to the end of the word

            
            if(selectedItemIndex > MaxResults-1) {
                newItemIndex = 0;
            } else {
                newItemIndex = itemIndex+1;
            }
        }

        if(e.keyCode === KEY_CODE_ENTER || eventType === 'mousedown') {
            const text = (!filteredData[itemIndex]) ? autocompleteInputRef.current.value : filteredData[itemIndex];

            setShouldShowAutocompleteList(false);

            onSubmit(e, text);
            autocompleteInputRef.current.value = text;
        }

        setSelectedItemIndex(newItemIndex)

        handleScrollBehaviour(newItemIndex);
    }

    const handleScrollBehaviour = (newItemIndex) => {
        const totalListHeight = autocompleteElmRef?.current?.offsetHeight;
        const singleItemHeight = autocompleteElmRef?.current?.children[0]?.offsetHeight;
        const startViewPosition = autocompleteElmRef?.current?.scrollTop;
        const endViewPosition = autocompleteElmRef?.current?.scrollTop+totalListHeight;
        const nextPosition = singleItemHeight*(newItemIndex+1);
        const prevPosition = singleItemHeight*(newItemIndex);
        
        if(prevPosition <= startViewPosition) {
            autocompleteElmRef.current.scrollTop = (newItemIndex)*singleItemHeight;
        }
        if(nextPosition >= endViewPosition) {
            autocompleteElmRef.current.scrollTop = (newItemIndex+1)*singleItemHeight-totalListHeight;
        }
    }

    const fn = debounce(handleOnChange, 300);

    return (
        <div className="autocomplete-container" style={autocompleteStyleRef.current}>
            {inputToRender({
                onChange: fn,
                onKeyDown: handleOnKeyDown,
                ref: autocompleteInputRef,
                placeholder: "Autocomplete",
                className: "autocomplete-input",
                "data-testid": "autocomplete-input"
            })}
            {shouldShowAutocompleteList &&
                <ul ref={autocompleteElmRef}
                    className="autocomplete-list"
                    id="autocomplete-list"
                    data-testid="autocomplete-list"
                    style={listStyleRef.current}>
                        {filteredData.map((word, key) => 
                            <li key={word}
                            data-key={key}
                            className={selectedItemIndex === key ? 'selected' : ''}
                            onMouseDown={handleOnKeyDown}
                            data-testid="autocomplete-single-item">
                                <MemoizedHighlight word={word}query={query}/>
                            </li>)}
                </ul>}
        </div>
    )
}

export default LightAutocomplete;