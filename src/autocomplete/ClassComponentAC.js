import React from 'react';
import { debounce, matchQuery, autocompleteDefaultStyle, listDefaultStyle } from '../utils';
import { MemoizedHighlight } from './Highlight';
import './autocomplete.scss';

let cache = new Map();
const MAX_RESULTS = 10;

class Autocomplete extends React.Component {
    constructor({autocompleteStyle, listStyle}) {
        super();
        this.state = {
            filteredData: [],
            selectedItemIndex: 0,
            shouldShowAutocompleteList: false
        }

        this.debouncedHandleChange = debounce(this.handleOnChange, 100);

        this.autocompleteStyle = Object.assign({}, autocompleteDefaultStyle, autocompleteStyle);
        this.listStyle = Object.assign({}, listDefaultStyle, listStyle);
    }

    handleOnChange = async (e) => {
        const {
            asyncCall
        } = this.props;

        const query = e.target.value;
        let optionsFromServer;
        let shouldShowAutocompleteList;

        let res;
        if(cache.has(query)) {
            res = cache.get(query);
        } else {
            try {
                optionsFromServer = await asyncCall();
                res = this.filterData(optionsFromServer.data, query);
                cache.set(query, res);
            } catch(err) {
                console.log(err);
            }
        }

        const limitedViewResults = res?.slice(0, MAX_RESULTS) || [];
        shouldShowAutocompleteList = (res?.length >= 1) && (query?.length >= 1);
        this.setState({
            query,
            filteredData: limitedViewResults,
            shouldShowAutocompleteList
        });
    }

    filterData(options, query) {
        let newOptions = options.filter((item) => {
            return matchQuery(item, query);
        });

        return newOptions;
    }

    handleOnKeyDown = (e) => {
        const {
            selectedItemIndex,
            filteredData,
            shouldShowAutocompleteList
         } = this.state;

         const {
            onSubmit,
         } = this.props;

        const KEY_CODE_DOWN = 40;
        const KEY_CODE_UP = 38;
        const KEY_CODE_ENTER = 13;
        const keyDataAttr = e.target.getAttribute('data-key');
        const newItemIndex = keyDataAttr >= 0 && keyDataAttr !== null ? keyDataAttr : selectedItemIndex;
        const eventType = e.type;
        const MaxResults =  Math.min(filteredData.length, MAX_RESULTS);
        let nextSelectedItemIndex = selectedItemIndex;
        let newShowAutocompleteList = shouldShowAutocompleteList;

        if(e.keyCode === KEY_CODE_UP) {
            e.preventDefault(); // hack: prevent native behaviour of cursor to jump to the beginning of the word

            if(selectedItemIndex < 0) {
                nextSelectedItemIndex = (MaxResults-1);
            } else {
                nextSelectedItemIndex = (newItemIndex-1);
            }

        }

        if(e.keyCode === KEY_CODE_DOWN) {
            e.preventDefault(); // hack: prevent native behaviour of cursor to jump to the end of the word

            
            if(selectedItemIndex > MaxResults-1) {
                nextSelectedItemIndex = (0);
            } else {
                nextSelectedItemIndex = (newItemIndex+1);
            }
        }

        if(e.keyCode === KEY_CODE_ENTER || eventType === 'mousedown') {
            const text = (!filteredData[newItemIndex]) ? this.autocompleteInput.value : filteredData[newItemIndex];

            newShowAutocompleteList = false;
            onSubmit(e, text);
            this.autocompleteInput.value = text;
        }

        this.setState({
            selectedItemIndex: nextSelectedItemIndex,
            shouldShowAutocompleteList: newShowAutocompleteList
        });
    }

    render() {
        const {
            inputToRender,
        } = this.props;

        const {
            filteredData,
            query,
            selectedItemIndex,
            shouldShowAutocompleteList
        } = this.state;

        return (
            <div className="autocomplete-container" style={this.autocompleteStyle}>
                {inputToRender({
                    onChange: this.debouncedHandleChange,
                    onKeyDown: this.handleOnKeyDown,
                    ref: (el) => this.autocompleteInput = el,
                    placeholder: "Autocomplete",
                    className: "autocomplete-input",
                    "data-testid": "autocomplete-input"
                })}
                {shouldShowAutocompleteList &&
                    <ul ref={(el) => {this.autocompleteElm = el}}
                        className="autocomplete-list"
                        id="autocomplete-list"
                        data-testid="autocomplete-list"
                        style={this.listStyle}>
                            {filteredData.map((word, key) => 
                                <li key={word}
                                data-key={key}
                                className={selectedItemIndex === key ? 'selected' : ''}
                                onMouseDown={this.handleOnKeyDown}
                                data-testid="autocomplete-single-item">
                                    <MemoizedHighlight word={word} query={query}/>
                                </li>)}
                    </ul>}
            </div>
        )
    }
}


export default Autocomplete;