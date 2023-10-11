import { WSA_URL, analyzeText } from '@/app/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export const GET = async (res: NextRequest) => {
	const { searchParams } = res.nextUrl;
	const rating: boolean = Boolean(searchParams.get('rating'));
	const words: boolean = Boolean(searchParams.get('words'));

	const article = searchParams.get('article') as string;

	const browser = await puppeteer.launch({ headless: 'new' });
	const wsaArticlePage = await browser.newPage();
	console.log(WSA_URL + article);
	await wsaArticlePage.goto(WSA_URL + article);
	await wsaArticlePage.waitForSelector('body > div > div');

	const htmlContent = await wsaArticlePage.content();
	await wsaArticlePage.close();
	const $ = cheerio.load(htmlContent);

	const title = $('body > div > div > div > div > div > div > div:nth-child(2)').text();
	const topic = $('body > div > div > div > div > div > div > div:nth-child(1)').text();
	const articleContentElem = $('body > div > div > div > div > div > div > div:nth-child(3) > div');
	const content = articleContentElem.map((i, el) => $(el).text()).toArray();

	const wordCount = content.join(' ').split(' ').length;

	const contentString = content.join(' ');

	const sentiment = analyzeText(contentString);

	return NextResponse.json({ title, content, wordCount, sentiment, topic, success: content.length > 0 });
};
