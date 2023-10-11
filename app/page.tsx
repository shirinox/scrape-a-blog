'use client';

import Link from 'next/link';
import { Loader2, Newspaper } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import Button from './components/Button';
import toast from 'react-hot-toast';

export default function Home() {
	const [article, setArticle] = useState<string>('');
	const [enableWords, setEnableWords] = useState<boolean>(true);
	const [enableSentiment, setEnableSentiment] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const handleClick = async (e: MouseEvent) => {
		e.preventDefault();
		if (isLoading) return toast.error('Already scraping data', { position: 'top-right' });
		setIsLoading(true);
		console.log(article);
		if (article) {
			const res = await fetch(
				`/api/scrape/article?article=${article}&words=${enableWords}&sentiment=${enableSentiment}`
			);
			const body = await res.json();
			console.log(body);
			return;
		}

		const res = await fetch(`/api/scrape/all?words=${enableWords}&sentiment=${enableSentiment}`);
		const body = await res.json();
		console.log(body);
		setIsLoading(false);
		return;
	};
	return (
		<div className='my-8'>
			<h1 className='text-5xl font-bold flex gap-2 items-center justify-center'>
				<Newspaper className='w-8 h-8' />
				Scrape-a-blog
			</h1>
			<p className='text-xs text-center my-2'>
				made by{' '}
				<Link className='underline font-medium' href='https://github.com/shirinox'>
					shirinox
				</Link>
			</p>
			<div>
				<SearchBar setArticle={setArticle} />
				<Button
					onClick={(e: MouseEvent) => handleClick(e)}
					className='bg-zinc-800 text-white font-semibold px-4 py-1.5 rounded-full mx-auto block '
				>
					Scrape
				</Button>
			</div>
			{isLoading && (
				<div className='mx-auto'>
					<Loader2 className='animate-spin w-10 h-10 m-2 mx-auto' />
					<p className='text-center'>Scraping data...</p>
				</div>
			)}
		</div>
	);
}
