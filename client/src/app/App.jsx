import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import store from './store';
import { router } from './routes/AppRoutes';

/**
 * Root App component.
 * Wraps the entire application in Redux Provider and React Router's RouterProvider.
 */
const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
