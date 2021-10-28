import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Web3 from "web3";

import abi from "./abi.json";

function Home() {
    const [result, setResult] = useState(<p>이름을 입력하세요</p>);

    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contract = new web3.eth.Contract(
        abi,
        "0x3bc0dBc41Db66D08FecdDdf940D305efee94002a"
    );

    const getList = async event => {
        const name = event.target.value;
        
        try {
            const list = await contract.methods.getList(name).call();

            if (list) {
                setResult(<p><Link to={`/list/${name}`}>이곳</Link>으로 가십시오.</p>);
            }
        }
        catch {
            setResult(<p>리스트가 없습니다. <Link to={`/edit/${name}`}>생성하시겠습니까?</Link></p>);
        }
    }

    return (
        <form>
            <input type="text" onChange={getList} />
            {result}
        </form>
    )
}

export default Home;