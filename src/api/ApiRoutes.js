export const StatusData = {
	loading:'loading',
	succeeded:'succeeded',
	failed:'failed',
	idle:'idle'
}

export const apiName = '/fakeApi';

export const postName = 'posts';

export const postsRoute = `${apiName}/${postName}`;

export const singlePostPath = `/single/:postId`;
export const editPostPath = `/edit/:postId`;

export const singlePostRoute = `${postsRoute}${singlePostPath}`;
