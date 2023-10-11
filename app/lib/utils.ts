export const WSA_URL = 'https://wsa-test.vercel.app';
export const BASE_URL = 'http://localhost:3000';

export const GOOD_WORDS = [
	'good',
	'great',
	'amazing',
	'awesome',
	'nice',
	'cool',
	'fantastic',
	'wonderful',
	'excellent',
	'joy',
	'happy',
	'happyiness',
	'magnificent',
	'perfect',
	'vibrant',
	'delightful',
];

export const BAD_WORDS = [
	'negative',
	'bad',
	'terrible',
	'horrible',
	'awful',
	'sad',
	'unhappy',
	'unhappyiness',
	'depressed',
	'depression',
	'depressing',
];

export const analyzeText = (text: string) => {
	const words = text.split(' ');
	const goodWords = words.filter((word) => GOOD_WORDS.includes(word));
	const badWords = words.filter((word) => BAD_WORDS.includes(word));

	const rating = goodWords.length - badWords.length;

	return rating > 0 ? 'positive' : rating < 0 ? 'negative' : 'neutral';
};
