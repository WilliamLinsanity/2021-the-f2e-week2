import './App.css';
import Header from './components/Header';
import Map from './components/Map'
import SearchBlock from './components/SearchBlock';
import { Provider } from "react-redux";
import { createStore } from "redux";
import styled from "@emotion/styled";
import reduce from "./components/redux/reduce";

const store = createStore(reduce);

const Container = styled.div`
display: flex;
position: relative;
height: 90vh;
`

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Header/>
        <Container>
          <SearchBlock/>
          <Map></Map>
        </Container>
      </Provider>
    </div>
  );
}

export default App;
