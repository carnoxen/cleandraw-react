import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from "web3";

import abi from "./abi.json";

function ListItem(props) {
    return <li>{props.value}</li>
}

function Edit({match}) {

    const [userSet, setUserSet] = useState(new Set());
    const [rankMap, setRankMap] = useState(new Map());

    const [user, setUser] = useState("");
    const [rank_name, setRankName] = useState("");
    const [rank_count, setRankCount] = useState(1);
    
    const name = match.params.name;
    const history = useHistory();
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const contract = new web3.eth.Contract(
        abi,
        "0x3bc0dBc41Db66D08FecdDdf940D305efee94002a"
    );

    useEffect(() => {
        window.ethereum.request({ method: "eth_requestAccounts" });
    })

    const addUser = () => {
        setUserSet(new Set([...userSet, user]));
    }

    const addRank = () => {
        setRankMap(new Map([...rankMap, [rank_name, Number(rank_count)]]));
    }

    const createList = async event => {
        event.preventDefault();
        
        try {
            const account = await web3.eth.getAccounts().then(accs => accs[0]);

            const uarr = [...userSet];
            const marr = [...rankMap].map(element => [...element, []]);

            await contract.methods.allocateUsers(uarr, marr, name)
            .send({ from: account });
            
            history.push(`/list/${name}`);
        }
        catch (e) {
            console.error(e)
        }
    }

    return (
        <React.Fragment>
            <form onSubmit={createList}>
                <fieldset>
                    <legend>사용자</legend>
                    <input type="text" id="user" minLength="1" value={user} onChange={e => setUser(e.target.value)} /><br />
                    <input type="button" value="사용자 추가" onClick={addUser} />
                    <ul id="user_list">{[...userSet].map(e => <ListItem key={e} value={e} />)}</ul>
                </fieldset>
                <fieldset>
                    <legend>랭크</legend>
                    <input type="text" id="rank_name" minLength="1" value={rank_name} onChange={e => setRankName(e.target.value)} /><br />
                    <input type="number" id="rank_count" min="1" value={rank_count} onChange={e => setRankCount(e.target.value)} /><br />
                    <input type="button" value="랭크 및 추첨자 수 추가" onClick={addRank} />
                    <ul id="rank_list">{[...rankMap].map(e => <ListItem key={e[0]} value={`${e[0]}: 최대 ${e[1]} 명`} />)}</ul>
                </fieldset>
                <input type="submit" value="추첨하기" />
            </form>
        </React.Fragment>
    )

}

export default Edit;