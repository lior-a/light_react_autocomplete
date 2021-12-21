import React from 'react';
import LightAutocomplete from './LightAutocomplete';
import mock from './LightAutocomplete/mock';

let asyncMock = () => Promise.resolve({data: mock});

let autocompleteStyle = {
  width: 300
}

let listStyle = {
  width: 330
}

const Comp = () => <LightAutocomplete
  asyncCall={asyncMock}
  onSubmit={(e,selectedItem) => console.log('submit form!', e,selectedItem)}
  autocompleteStyle={autocompleteStyle}
  listStyle={listStyle}
  inputToRender={(params) => <input type="text"
    {...params}
  />
}
/>

export default {
  title: 'Example/Autocomplete',
  component: Comp,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = (args) => <Comp {...args} />;

export const Primary = Template.bind({});