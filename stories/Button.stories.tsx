import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from 'react-native-paper';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color: { control: 'color' },
    mode: { 
      defaultValue: 'contained',
      control: 'radio',
      options: ['contained', 'outlined', 'text']
    },
    dark: {
      type: 'boolean',
      defaultValue: false,
    }
  },
  args: {
    
  }
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});

export const Outlined = Template.bind({});

export const Text = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  mode: 'contained',
  children: 'My button title'
};

Outlined.args = {
  mode: 'outlined',
  children: 'My button title'
};

Text.args = {
  mode: 'text',
  children: 'My button title'
};