import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';
import Home from './pages/Home';
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'games',
        Component: Games,
      },
      {
        path: 'game/:gameId',
        Component: GameDetail,
      },
    ],
  },
]);
