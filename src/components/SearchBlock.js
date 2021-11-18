import styled from "@emotion/styled";

const SearchContainer = styled.div`
grid-area:search;
background-color: #FFFFFF;
width: 400px;
display: flex;
flex-direction: column;
padding: 24px 24px 16px 24px;
box-shadow: 0px 0px 10px rgba(38, 38, 38, 0.25);
`

const SearchBar = styled.div`
width: 100%;
background-color: #FFFFFF;
border-radius: 8px;
height: 200px;
flex:0;
`
const SearchTop = styled.div`
background: #0E5978;
height: 24px;
`

const SearchResult = styled.div`
flex:1;
`
const SearchBlock = () =>{
    return(
        <SearchContainer>
            <SearchBar>
                <SearchTop/>
            </SearchBar>
            <SearchResult>

            </SearchResult>
        </SearchContainer>
    )
}
export default SearchBlock;