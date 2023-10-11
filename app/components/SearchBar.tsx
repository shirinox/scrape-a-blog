import { MousePointer2, Search } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { WSA_URL } from '../lib/utils';

const SearchBar = ({ setArticle }: { setArticle: Dispatch<SetStateAction<string>> }) => {
	return (
		<div className='bg-zinc-200 w-fit p-4 rounded-full flex gap-2 relative mx-auto mt-16 mb-4'>
			<Search className='text-zinc-600' />
			<p className='text-zinc-400 cursor-not-allowed select-none underline'>{WSA_URL}</p>
			<input
				type='text'
				onChange={(e) => setArticle(e.target.value)}
				className='bg-transparent border-0 outline-none placeholder:text-zinc-400'
				placeholder='/blog/the-joys-of-gardening'
			/>

			<MousePointer2 className='absolute -bottom-2 -right-4 w-8 h-8 text-zinc-800/50 fill-zinc-800' />
		</div>
	);
};

export default SearchBar;
