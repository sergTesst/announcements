export const StatusData = {
	loading:'loading',
	succeeded:'succeeded',
	failed:'failed',
	idle:'idle'
}

export const apiName = '/fakeApi';

export const postName = 'posts';

export const postsRoute = `${apiName}/${postName}`;
export const singlePostRoute = `${postsRoute}/single/:postId`;