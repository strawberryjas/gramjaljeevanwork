import '../src/index.css';
import { AppContextProvider } from '../src/context/AppContext';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'gray',
          value: '#f3f4f6',
        },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <AppContextProvider>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </AppContextProvider>
    ),
  ],
};

export default preview;
