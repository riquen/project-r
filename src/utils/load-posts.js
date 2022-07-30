export const loadPosts = async (postsJson, photosJson) => {
  const postsAndPhotos = await postsJson.map((post, index) => {
    return { ...post, cover: photosJson[index].url };
  });

  return postsAndPhotos;
};
