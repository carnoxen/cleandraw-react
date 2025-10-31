import { useState, type FormEventHandler } from 'react';
import { useFormStatus } from 'react-dom';
import { redirect } from 'react-router';
import { getContractWithSigner } from '~/contract';

type Gashapon = {
    users: Set<string>;
    ranks: Map<string, number>
}

export default function Edit() {
    const {pending} = useFormStatus();
    const [name, setName] = useState('');
    const [user, setUser] = useState("");
    const [rank_name, setRankName] = useState("");
    const [rank_count, setRankCount] = useState("1");
    const [gashapon, setGashapon] = useState<Gashapon>({ users: new Set(), ranks: new Map() });

    const addUser = () => {
        const users = gashapon.users;
        setGashapon({
            ...gashapon, 
            users: new Set([...users, user])
        });
        setUser("");
    }

    const addRank = () => {
        const ranks = gashapon.ranks;
        setGashapon({
            ...gashapon, 
            ranks: new Map([...ranks, [rank_name, Number(rank_count)]])
        });
        setRankName("");
        setRankCount("1");
    }

    const createList: FormEventHandler = async event => {
        event.preventDefault();
        
        try {
            const users = [...gashapon.users];
            const ranks = [...gashapon.ranks].map(element => [...element, []]);

            const contract = await getContractWithSigner();
            await contract.allocateUsers(users, ranks, name);
            redirect(`/?name=${name}`);
        }
        catch (e) {
            console.error(e)
        }
    }

    return (
        <main>
            <form onSubmit={createList}>
                <fieldset>
                    <legend>추첨 이름</legend>
                    <input type="text" id="name" minLength={1} value={name} onChange={e => setName(e.target.value)} />
                </fieldset>
                <fieldset>
                    <legend>사용자</legend>
                    <input type="text" id="user" minLength={1} value={user} onChange={e => setUser(e.target.value)} /> 
                    <input type="button" value="사용자 추가" onClick={addUser} />
                </fieldset>
                <fieldset>
                    <legend>순위</legend>
                    <input type="text" id="rank_name" minLength={1} value={rank_name} onChange={e => setRankName(e.target.value)} /> 
                    <input type="number" id="rank_count" min="1" value={rank_count} onChange={e => setRankCount(e.target.value)} /> 
                    <input type="button" value="순위 이름 및 최대 추첨 수 추가" onClick={addRank} />
                </fieldset>
                <input type="submit" value="추첨하기" disabled={pending} />
                <output htmlFor="name user rank_name rank_count">
                    <ul id="user_list">
                        {[...gashapon.users].map(e => <li key={e}>{e}</li>)}
                    </ul>
                    <ol id="rank_list">
                        {[...gashapon.ranks].map(([name, value]) => <li key={name}>{name}: 최대 ${value} 명</li>)}
                    </ol>
                </output>
            </form>
        </main>
    )
}