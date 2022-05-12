/* eslint-disable functional/immutable-data */

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TextInput } from 'react-native-paper';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/TextInput',
  component: TextInput,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color: { control: 'color' },
    mode: {
      defaultValue: 'contained',
      control: 'radio',
      options: ['contained', 'outlined', 'text'],
    },
    dark: {
      type: 'boolean',
      defaultValue: false,
    },
  },
  args: {

  },
} as ComponentMeta<typeof TextInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TextInput> = (args) => <TextInput {...args} />;

export const Primary = Template.bind({});

export const Secondary = Template.bind({ });

export const Outlined = Template.bind({});

export const Text = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: 'Flat',
  mode: 'flat',
  value: '',
  dense: true,
  onChangeText: () => {},
  underlineColor: 'green',
  style: {},
  outlineColor: 'green',
  placeholder: 'Placeholder',
  selectionColor: 'green',
  theme: { colors: { primary: '#ccc', text: '#000' } },
  left: () => {},
  right: { name: 'search' },
  disabled: false,
};

Secondary.args = {
  label: 'Secondary',
  mode: 'outlined',
  dense: true,

};

Outlined.args = {
  label: 'Outlined',
  mode: 'outlined',

};

/* Text.args = {

}; */
