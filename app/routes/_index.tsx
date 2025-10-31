import { useState, type FormEventHandler } from 'react';
import { getContract } from "../contract";
import type { Route } from '../+types/root';
import { redirect, useSearchParams } from 'react-router';

type RankTuple = [string, number, string[]]

export async function loader() {
    const [searchParams] = useSearchParams();
    const name = searchParams.get("name");

    if (name) {
        const contract = getContract();
        const list: RankTuple[] = await contract.getList(name);

        return (
            <ol>
                {list.map(([name, _, selections]) => (
                    <li key={name}>{name}
                        <ul>
                            {selections.map(winner => <li key={winner}>{winner}</li>)}
                        </ul>
                    </li>
                ))}
            </ol>
        );
    }
    
    return (
        <p>Go to <a href="/edit">Edit</a> page</p>
    );
}

export default function Home({
  loaderData,
}: Route.ComponentProps) {
    const data = loaderData;
    const [query, setQuery] = useState("");

    const getList: FormEventHandler = async event => {
        redirect(`/?name=${query}`)
    }

    return (
        <form onSubmit={getList}>
            <input type="text" id="name" name="name" value={query} onChange={e => setQuery(e.target.value)} />
            <input type="submit" value="검색" />
            <output htmlFor="name">{data}</output>
        </form>
    )
}