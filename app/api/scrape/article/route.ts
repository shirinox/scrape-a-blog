import { WSA_URL, analyzeText } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';
import chromium from '@sparticuz/chromium-min';

export type ArticleContent = {
	title: string | undefined;
	content: string[] | undefined;
	wordCount: number | undefined;
	sentiment: string | undefined;
	topic: string | undefined;
};

export const GET = async (res: NextRequest) => {
	const { searchParams } = res.nextUrl;
	const rating: boolean = Boolean(searchParams.get('rating'));
	const words: boolean = Boolean(searchParams.get('words'));

	const article = searchParams.get('article') as string;
	if (!article) return NextResponse.json({ error: 'No article parameter was provided.' }, { status: 400 });

	// ? might be better to return status instead of success
	if (!article) return NextResponse.json({ error: 'No article parameter provided.', success: false });

	const browser = await puppeteer.launch({
		args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
		executablePath: await chromium.executablePath(
			`https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
		),
		headless: 'new',
		ignoreHTTPSErrors: true,
	});
	const wsaArticlePage = await browser.newPage();
	await wsaArticlePage.setRequestInterception(true);
	wsaArticlePage.on('request', (request) => {
		if (['stylesheet', 'font'].includes(request.resourceType())) request.abort();
		else request.continue();
	});
	console.log(WSA_URL + article);
	await wsaArticlePage.goto(WSA_URL + '/' + article);
	await wsaArticlePage.waitForSelector('body > div > div');

	const htmlContent = await wsaArticlePage.content();
	await wsaArticlePage.close();
	const $ = cheerio.load(htmlContent);

	const title = $('body > div > div > div > div > div > div > div:nth-child(2)').text();
	const topic = $('body > div > div > div > div > div > div > div:nth-child(1)').text();
	const articleContentElem = $('body > div > div > div > div > div > div > div:nth-child(3) > div');
	const content = articleContentElem.map((i, el) => $(el).text()).toArray();
	const contentString = content.join(' ');

	const wordCount = contentString.split(' ').length;
	const sentiment = analyzeText(contentString);

	if (!content || !title || !topic)
		return NextResponse.json({ error: 'No article content was found.' }, { status: 400 });
	else
		return NextResponse.json(
			{ title, content, wordCount, sentiment, topic, success: content.length > 0 },
			{
				status: 200,
			}
		);
};
