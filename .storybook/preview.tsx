import type { Preview } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../src/store';
import '../src/styles/global.scss';

const preview: Preview = {
  decorators: [
    Story => (
      <Provider store={store}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </Provider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'parchment',
      values: [
        { name: 'parchment', value: '#F6F2E9' },
        { name: 'white', value: '#ffffff' },
        { name: 'navy', value: '#1B2A40' },
      ],
    },
  },
};

export default preview;
