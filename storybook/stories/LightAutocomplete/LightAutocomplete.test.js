import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom'
import Autocomplete from './index';
import mock from '../../demo_page/src/mock';
import React from 'react';

let asyncMock = () => Promise.resolve({data: mock});

let autocompleteStyle = {
    width: 300
}

let listStyle = {
    width: 330
}

let renderRes = null;
let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);

  renderRes = render(<Autocomplete
        asyncCall={asyncMock}
        onSubmit={(e,selectedItem) => console.log('submit form!',selectedItem)}
        autocompleteStyle={autocompleteStyle}
        listStyle={listStyle}
        inputToRender={(params) => <input type="text"
            {...params}
        />}
    />, container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  renderRes = null;
});

describe("Search in autocomplete", () => {
    test('typing text in autocomplete input and check the number of results dose not exceed 30', async () => {
        const inputElm = screen.getByTestId('autocomplete-input');
        fireEvent.change(inputElm, {target: {value: 'aa'}});
        
        await waitFor(() => expect(screen.getAllByTestId('autocomplete-single-item').length).toBe(30));
    });

    test('typing text in autocomplete input and check the number of results should be 1', async () => {
        const inputElm = screen.getByTestId('autocomplete-input');
        fireEvent.change(inputElm, {target: {value: 'abb'}});
        
        await waitFor(() => expect(screen.getAllByTestId('autocomplete-single-item').length).toBe(1));
    });

    test('typing word without result in autocomplete input and check the number of results should be 0', async () => {
        const inputElm = screen.getByTestId('autocomplete-input');
        fireEvent.change(inputElm, {target: {value: 'dadasdasd'}});

        await waitFor(() => expect(screen.queryByTestId('[data-testid="autocomplete-single-item"]')).not.toBeInTheDocument);
    });

    test('typing text than press enter should select the input typed word' ,async () => {
        const input = renderRes.getByRole("textbox");
        fireEvent.change(input, { target: {value: "aa"} });
        fireEvent.keyDown(input, { key: 'Enter' });
        
        await waitFor(() => expect(input.value).toBe('aa'));
    });

    test('typing text following with 2 keys arrow down than pressing enter should select the current item' ,async () => {
        const input = screen.getByTestId('autocomplete-input');
        fireEvent.change(input, {target: {value: 'a'}});
        
        await waitFor(() => {
            fireEvent.keyDown(input, {
                keyCode: 40,
                charCode: 40,
                key: "ArrowDown",
                code: "ArrowDown"
            });

            fireEvent.keyDown(input, {
                keyCode: 40,
                charCode: 40,
                key: "ArrowDown",
                code: "ArrowDown"
            });
    
            fireEvent.keyDown(input, {
                keyCode: 13,
                charCode: 13,
                key: 'Enter',
                code: 'Enter'
            });

            return expect(input.value).toBe('Aarez');
        });
    });

    test('typing text following with 2 keys arrow down and 1 key up than pressing enter should select the current item' ,async () => {
        const input = screen.getByTestId('autocomplete-input');
        fireEvent.change(input, {target: {value: 'a'}});
        
        await waitFor(() => {
            fireEvent.keyDown(input, {
                keyCode: 40,
                charCode: 40,
                key: "ArrowDown",
                code: "ArrowDown"
            });
    
            fireEvent.keyDown(input, {
                keyCode: 40,
                charCode: 40,
                key: "ArrowDown",
                code: "ArrowDown"
            });

            fireEvent.keyUp(input, {
                keyCode: 38,
                charCode: 38,
                key: "ArrowUp",
                code: "ArrowUp"
            });
    
            fireEvent.keyDown(input, {
                keyCode: 13,
                charCode: 13,
                key: 'Enter',
                code: 'Enter'
            });
            return expect(input.value).toBe('Abdur')
        });
    });

    test('typing text in autocomplete and picking a result from the list with mouse click that results with submit', async () => {
        const input = screen.getByTestId('autocomplete-input');
        fireEvent.change(input, {target: {value: 'a'}});
        
        await waitFor(() => {
            const option3 = screen.getAllByTestId('autocomplete-single-item')[2];
            fireEvent.mouseDown(option3);
        });
        await waitFor(() => expect(input.value).toBe('Aarez'));
    });
});