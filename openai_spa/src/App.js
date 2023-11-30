import React from "react";
import { Provider } from 'react-redux';
import store from './redux/store';

import Body from './pages/Body'

function App() {
  return (
    <div className="bg-gray-100">
      <Provider store={store}>
        <Body />
      </Provider>
    </div>
  );
}

export default App;
