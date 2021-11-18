import styled from "@emotion/styled";
import { useState } from "react";
import logo from '../assets/images/logo.png'
// import findBtn from '../assets/images/findBtn.png'
const Container = styled.div`
display: flex;
justify-content: space-between;
background-color: #FFFFFF;
height: 80px;
padding:0 120px 0 32px;
`
const LogoBtn = styled.img``
const HeaderBtnGroup = styled.div`

`
const HeaderBtn = styled.button`
    font-size: 16px;
    background-color: #FFFFFF;
    color: #0E5978;
    font-weight: bold;
    &:hover{
        background: #F0F9FC;
        color: #12749D;
    }

    &.active{
        background: #0E5978;
        color: #FFFFFF;
    }

    border-radius: 4px;
    padding: 8px 16px;
    margin: 20px 6px;
    border:0;
`

const Header = () =>{
    const btnList = [{name:'尋找單車',value:'bike',isActive:false},{name:'尋找車道',value:'road',isActive:false}]
    const [isActiveItem,handleChangeActive] = useState('')
    const handleClick = (value) =>{
        btnList.forEach((item) => {
            if(item.value === value){
                handleChangeActive(item.value)
            }
        })
    }
   
    return(
        <Container>
            <LogoBtn src={logo}/>
            <HeaderBtnGroup>
                {
                    btnList.map(item=>(
                        <HeaderBtn onClick={() =>handleClick(item.value)} className={item.value === isActiveItem? 'active': ''} key={item.value}>
                            {item.name}
                        </HeaderBtn>
                    ))
                }           
            </HeaderBtnGroup>
        </Container>
    )
}
export default Header;