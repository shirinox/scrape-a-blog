'use client';

import Link from 'next/link';
import { Loader2, Newspaper } from 'lucide-react';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import Button from './components/Button';
import toast from 'react-hot-toast';
import { Article } from './api/scrape/all/route';
import { ArticleContent } from './api/scrape/article/route';

export default function Home() {
	const [article, setArticle] = useState<string>('');
	const [articleData, setArticleData] = useState<Article[]>();
	const [articleContentData, setArticleContentData] = useState<ArticleContent>();
	const [enableWords, setEnableWords] = useState<boolean>(true);
	const [enableSentiment, setEnableSentiment] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	//fetch data from backend & store in state
	const handleClick = async (e: MouseEvent) => {
		e.preventDefault();
		setArticleData(undefined);
		setArticleContentData(undefined);
		if (isLoading) return toast.error('Already scraping data', { position: 'top-right' });
		setIsLoading(true);
		if (article) {
			const res = await fetch(
				`/api/scrape/article?article=${article}&words=${enableWords}&sentiment=${enableSentiment}`
			);
			if (res.ok === false) {
				setIsLoading(false);
				return toast.error('Article not found', { position: 'top-right' });
			}
			const body = await res.json();
			console.log(body);
			setArticleContentData(body);
			setIsLoading(false);
			console.log(article);
			return;
		}

		const res = await fetch(`/api/scrape/all?words=${enableWords}&sentiment=${enableSentiment}`);
		const body = await res.json();
		console.log(body);
		setArticleData(body);
		console.log(article);
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
				<div className='mx-auto my-4'>
					<Loader2 className='animate-spin w-10 h-10 m-2 mx-auto' />
					<p className='text-center'>Scraping data...</p>
				</div>
			)}
			{articleData && (
				<div className='mx-auto my-6'>
					<p className='text-center text-3xl font-semibold mb-8'>Scraped {articleData.length} articles</p>

					<div className='grid grid-cols-1 md:grid-cols-3 mx-auto gap-6 max-w-4xl'>
						{articleData.map((article, index) => (
							<div
								key={index}
								className='bg-zinc-100 border border-zinc-200 p-4 mx-4 md:mx-0 text-center'
							>
								<p className='text-xs'>{article.topic}</p>
								<Link href={article.link as string}>
									<p className='p-2 rounded-full underline w-fit mx-auto text-xs bg-zinc-200 m-2'>
										{article.title}
									</p>
								</Link>
								<p className='text-xs'>Written by {article.author}</p>
								<p className='font-medium mt-6'>Description</p>
								<p className=''>{article.short_description}</p>
								<p className='font-medium mt-6'>Sentiment</p>
								<p className='uppercase'>{article.sentiment}</p>
							</div>
						))}
					</div>
				</div>
			)}
			{articleContentData && (
				<div className='mx-auto my-6'>
					<p className='text-center text-3xl font-semibold mb-8'>Scraped {article}</p>
					<div className='grid grid-cols-1 mx-auto gap-6 max-w-4xl'>
						<div className='bg-zinc-100 border border-zinc-200 p-4 mx-4 md:mx-0'>
							<p className='p-2 rounded-full w-fit mx-auto text-xs bg-zinc-200 m-2 text-center'>
								{articleContentData.title}
							</p>
							<p className='text-xs text-center'>Sentiment: {articleContentData.sentiment}</p>
							<p className='font-medium mt-6'>Content</p>
							<p className='text-left'>{articleContentData.content}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
