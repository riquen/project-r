import { useCallback, useEffect, useState } from 'react';

import './styles.css';

import { Posts } from '../../components/Posts';
import { loadPosts } from '../../utils/load-posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import useFetch from '../../hooks/useFetch';

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [postsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [postsResult, postsLoading] = useFetch(
    'https://jsonplaceholder.typicode.com/posts',
  );
  const [photosResult, photosLoading] = useFetch(
    'https://jsonplaceholder.typicode.com/photos',
  );

  const noMorePosts = page + postsPerPage >= allPosts.length;

  const filteredPosts = searchValue
    ? allPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchValue.toLowerCase());
      })
    : posts;

  const handleLoadPosts = useCallback(
    async (page, postsPerPage) => {
      const postsAndPhotos = await loadPosts(postsResult, photosResult);

      setPosts(postsAndPhotos.slice(page, postsPerPage));
      setAllPosts(postsAndPhotos);
    },
    [photosResult, postsResult],
  );

  useEffect(() => {
    handleLoadPosts(0, postsPerPage);
  }, [handleLoadPosts, postsPerPage]);

  const loadMorePosts = () => {
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    setPosts(posts);
    setPage(nextPage);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  return (
    <section className="container">
      <div className="search-container">
        {!!searchValue && <h1>Search value: {searchValue}</h1>}

        <TextInput searchValue={searchValue} handleChange={handleChange} />
      </div>

      {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}

      {filteredPosts.length === 0 && postsLoading && photosLoading && (
        <p>Não existem posts</p>
      )}

      <div className="button-container">
        {!searchValue && (
          <Button
            text="Load more"
            onClick={loadMorePosts}
            disabled={noMorePosts}
          />
        )}
      </div>
    </section>
  );
};
