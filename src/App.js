import React, { useState } from 'react';
import Web3 from "web3";
import abi from "./abi.json";

function ListItem(props) {
  return <li>{props.value}</li>
}

function setToArray(s) {
  return Array.from(s).map(user => <ListItem key={user} value={user} />)
}

function mapToArray(m) {
  return Array.from(m).map(rank => <ListItem key={rank[0]} value={`${rank[0]}: 최대 ${rank[1]} 명`} />);
}

function App() {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  const [mode, setMode] = useState("home");
  const [contract, ] = useState(new web3.eth.Contract(
    abi,
    "0x3bc0dBc41Db66D08FecdDdf940D305efee94002a"
  ));

  const [users, editUsers] = useState(new Set());
  const [ranks, editRanks] = useState(new Map());
  const [listname, setListName] = useState("");

  const [user, setUser] = useState("");
  const [rank_name, setRankName] = useState("");
  const [rank_count, setRankCount] = useState(1);

  const searchForm = (
    <form onSubmit={async (e) => {
      e.preventDefault();

      try {
        window.ethereum.request({ method: "eth_requestAccounts" });
        console.log(listname);

        const list = await contract.methods.getList(listname).call();
        editRanks(new Map(list[0].map(rank => [rank[0], rank[2]])));

        setMode("list");
      }
      catch (e) {
        editUsers(new Set());
        editRanks(new Map());
        setMode("edit");
      }
    }}>
      <input type="text" id="listname"onChange={e => setListName(e.target.value)} /><input type="submit" value="생성 / 확인" />
    </form>
  )

  const editForm = (
    <div>
      <form onSubmit={e => {
          e.preventDefault();

          editUsers(users.add(user))
        }}>
        <ul id="user_list">{setToArray(users)}</ul>
        <input type="text" id="user" minLength="1" onChange={e => setUser(e.target.value)} /><br />
        <input type="submit" value="사용자 추가" />
      </form>
      <form onSubmit={e => {
          e.preventDefault();

          editRanks(ranks.set(rank_name, Number(rank_count)));
        }}>
        <ul id="rank_list">{mapToArray(ranks)}</ul>
        <input type="text" id="rank_name" minLength="1" onChange={e => setRankName(e.target.value)} /><br />
        <input type="number" id="rank_count" min="1" value={rank_count} onChange={e => setRankCount(e.target.value)} /><br />
        <input type="submit" value="랭크 및 추첨자 수 추가" />
      </form>
      <form onSubmit={async (e) => {
        e.preventDefault();

        try {
          const account = await web3.eth.getAccounts().then(accs => accs[0]);
          console.log(account);

          await contract.methods.allocateUsers(Array.from(users), Array.from(ranks).map(element => [...element, []]), listname)
          .send({
            from: account,
          }).then(console.log)

          const list = await contract.methods.getList(listname).call();
          editRanks(new Map(list[0].map(rank => [rank[0], rank[2]])));

          setMode("list");
        }
        catch (e) {
          console.error(e)
        }
      }}>
        <input type="submit" value="추첨하기" />
      </form>
    </div>
  )

  const lotteryList = (
    <ul>
      {Array.from(ranks).map(rank => (
        <li key={rank[0]}>{rank[0]}
          <ul>
            {Array.isArray(rank[1]) ? rank[1].map(winner => <li key={winner}>{winner}</li>) : ''}
          </ul>
        </li>
      ))}
      <button onClick={() => {
        setMode("home");
      }}>홈으로</button>
    </ul>
  )

  const selectMode = (mode) => {
    switch(mode) {
      case "home":
        return searchForm;
      case "edit":
        return editForm;
      default:
        return lotteryList;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main className="App-main">
        {selectMode(mode)}
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
