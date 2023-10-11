import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

import { BASE_URL, WSA_URL, analyzeText } from '@/app/lib/utils';

type Article = {
	title: string | undefined;
	topic: string | undefined;
	author: string | undefined;
	short_description: string | undefined;
	link: string | undefined;
	image: string | undefined;
};

export const GET = async (res: NextRequest) => {
	// determine if client needs rating or words to avoid unnecessary delay
	const { searchParams } = res.nextUrl;
	const rating: boolean = Boolean(searchParams.get('rating'));
	const words: boolean = Boolean(searchParams.get('words'));

	// load puppeteer and navigate to website
	const browser = await puppeteer.launch({ headless: 'new' });
	const wsaPage = await browser.newPage();
	await wsaPage.goto(WSA_URL);
	await wsaPage.waitForSelector('main');

	// load html content and parse with cheerio
	const htmlContent = await wsaPage.content();
	await wsaPage.close();
	const $ = cheerio.load(htmlContent);

	const articlesElem = $('main > div > div > div:nth-child(2) > div');
	const articles = articlesElem.map((i, el) => $(el).find('div')).get();

	// get all needed data from each article
	const articlesData: Article[] = await Promise.all(
		articles.map(async (article) => {
			const title = $(article).find('div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').text();
			const topic = $(article).find('div:nth-child(1) > div:nth-child(2)').text();
			const author = $(article).find('div:nth-child(1) > div:nth-child(1)').text();
			const short_description = $(article).find('div:nth-child(2) > div:nth-child(2) > div:nth-child(2)').text();
			const link = $(article).find('a').attr('href');
			const image = $(article).find('img').attr('src');

			const res = await fetch(`${BASE_URL}/api/scrape/article?article=${link}&rating=${rating}&words=${words}`);
			const articleData = await res.json();

			return {
				title,
				short_description,
				topic,
				author,
				sentiment: articleData.sentiment,
				link: WSA_URL + link,
				image: WSA_URL + image,
			};
		})
	);

	// return response
	return NextResponse.json({
		articles: articlesData,
		success: articlesData.length > 0 ? true : false,
	});
};
