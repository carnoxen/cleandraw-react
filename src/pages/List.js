import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from "web3";

import abi from "./abi.json";

function List({match}) {
    
    const [ranks, setRanks] = useState([]);
    
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contract = new web3.eth.Contract(
        abi,
        "0x3bc0dBc41Db66D08FecdDdf940D305efee94002a"
    );

    useEffect(() => {
        contract.methods.getList(match.params.name).call()
        .then(list => {
            setRanks(list[0].map(rank => [rank[0], rank[2]]))
        })
    })

    return (
        <React.Fragment>
            <ul>
                {ranks.map(rank => (
                    <li key={rank[0]}>{rank[0]}
                        <ul>
                            {rank[1].map(winner => <li key={winner}>{winner}</li>)}
                        </ul>
                    </li>
                ))}
            </ul>
            <Link to="/">홈으로</Link>
        </React.Fragment>
    )

}

export default List;