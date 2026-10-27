import type { Metadata } from 'next';
import { SearchResults } from '../components/v3/SearchResults';
import { SearchBox } from '../components/v3/SearchBox';
export const metadata:Metadata={title:'Find an investigation guide',robots:{index:false,follow:true}};
export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string|string[]}>}){const p=await searchParams;const query=typeof p.q==='string'?p.q.trim().slice(0,180):'';return <main className="mx-auto max-w-4xl px-5 py-12"><h1 className="mb-6 text-3xl font-bold text-navy-800">Find an investigation guide</h1><SearchBox/><div className="mt-8"><SearchResults query={query}/></div></main>}
