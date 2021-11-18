import './App.css';
import Header from './components/Header';
import Map from './components/Map'
import SearchBlock from './components/SearchBlock';
import styled from "@emotion/styled";
const Content = styled.div`
display: grid;
grid-template-columns: 1fr 9fr;
grid-template-areas:"search map";
`
function App() {
  return (
    <div className="App">
      <Header/>
      <Content>
          <SearchBlock/>
          <Map></Map>
      </Content>
    </div>
  );
}

export default App;
