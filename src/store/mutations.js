export const openSettings = (state) => {
  state.isSettingsOpen = true;
};

export const closeSettings = (state) => {
  state.isSettingsOpen = false;
};

export const setDarkMode = (state, value) => {
  state.settings.darkMode = value;
};

export const setShowNsfw = (state, value) => {
  state.settings.showNsfw = value;
};

export const initPosts = (state, { posts, lastPostId }) => {
  state.posts = posts;
  state.lastPostId = lastPostId;
};

export const resetPosts = (state) => {
  state.posts = [];
  state.lastPostId = null;
  state.scrollId = null;
};

export const appendPosts = (state, { posts, lastPostId }) => {
  state.posts = [...state.posts, ...posts];
  state.lastPostId = lastPostId;
};

export const saveScrollId = (state, id) => {
  state.scrollId = id;
};

export const showNsfwPostById = (state, id) => {
  state.posts = state.posts.map((postObj) => {
    if (postObj.post.id !== id) {
      return postObj;
    }
    return {
      ...postObj,
      post: {
        ...postObj.post,
        over_18: false,
      },
    };
  });
};
