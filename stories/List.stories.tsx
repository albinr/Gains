/* eslint-disable functional/immutable-data */

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { List } from 'react-native-paper';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/List',
  component: List.Item,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    mode: {
      control: {
        type: 'select',
        options: ['single-select', 'multi-select'],
      },
    },

  },

} as ComponentMeta<typeof List.Item>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof List.Item> = (args) => <List.Item {...args} />;

export const Primary = Template.bind({});

export const Secondary = Template.bind({ });

export const Outlined = Template.bind({});

export const Text = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: 'Primary',
  description: 'Primary description',
  style: { },
  left: () => <List.Icon icon='folder' />,

};

Secondary.args = {

};

Outlined.args = {

};

/* Text.args = {

}; */
