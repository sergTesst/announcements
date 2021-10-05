import {
  Server,
  Model,
  Factory,
  // belongsTo,
  // hasMany,
  // association,
  RestSerializer,

} from "miragejs";

import { nanoid } from "@reduxjs/toolkit";

import faker from "faker";

import { sentence, paragraph, article } from 'txtgen'


export default function makeServer(environment = "development") {
	return new Server({

		environment: environment,

		routes(){
			this.namespace = "/fakeApi";
			const server = this;


			this.get("/posts", (schema, req) => {

        const { from, to } = req.requestHeaders;

        let allPosts = schema.posts.all();

				let allPostsModels = allPosts.models;

        let resultPosts = allPostsModels.slice(from, to);

        return {
          posts: resultPosts,
          allPostsLength: allPostsModels.length,
        };
      });


			this.get("/posts/get/:query", (schema, req) => {

				const query = req.params["query"];

        const { from, to } = req.requestHeaders;

        let allPosts = schema.posts.all();

				let allPostsModels = allPosts.models;

				allPostsModels = allPostsModels.filter((post)=>{

					const normalizedPostTitle = post.title.toLocaleLowerCase();
					const normalizedQuery = query.toLocaleLowerCase();

					const titleIncludes =  normalizedPostTitle.includes(normalizedQuery);						
					return titleIncludes;

				});

        let resultPosts = allPostsModels.slice(from, to);

        return {
          posts: resultPosts,
          allPostsLength: allPostsModels.length,
        };
      });

			this.get("/posts/single/:postId", (schema, req) => {

        const postId = req.params["postId"];
        const post = schema.posts.find(postId);
        if (!post) throw new Error(`can not find post with ${postId}`);

				const allPosts = schema.posts.all();
        return {
          fetchedPost: post,
          allPostsLength: allPosts.length,
        };
      });

			this.post('/posts', function (schema, req) {

				const data = this.normalizedRequestAttrs()
				data.date = new Date().toISOString()
			
				const result = server.create('post', data);

				const allPosts = schema.posts.all();

				let allPostsModels = allPosts.models;

				const { query } = JSON.parse(req.requestBody);
				if(query!==''){
					allPostsModels = countPostsForQury(allPostsModels, query);
				}
			
        return {
          fetchedPost: result,
          allPostsLength: allPostsModels.length,
        };

			});

			this.put('/posts/:postId', function(schema, req){

				const postId = req.params["postId"];
				let post = schema.posts.find(postId);
				if (!post) throw new Error(`can not find post with ${postId}`);

				const data = this.normalizedRequestAttrs();

				if(postId !== data.id)
					throw new Error(`can not update post with ${postId}`);

				post.update({...data});
				return post;
			});

			this.post('/posts/delete/:postId', function(schema, req){

				const postId = req.params["postId"];
				let post = schema.posts.find(postId);
				if (!post) throw new Error(`can not find post with ${postId}`);
				post.destroy();

				const allPosts = schema.posts.all();

				let allPostsModels = allPosts.models;
				
				const { query } = JSON.parse(req.requestBody);
				if(query!==''){
					allPostsModels = countPostsForQury(allPostsModels, query);
				}

        return {
          deletedPostId:postId,
          allPostsLength: allPostsModels.length,
        };
			})

			

		},
		models:{
			post:Model.extend({})
		},
		factories:{
			post:Factory.extend({
				id() {
          return nanoid();
        },
        date() {
          return faker.date.recent(3);
        },
				title() {
          return sentence();
        },
				description(){
					return paragraph();
				}
			})
		},
		serializers: {
      application: RestSerializer,

    },

		seeds(server){
			server.createList('post',100);
			server.create('post',{id:'knownId'});
		}

	})
}

function countPostsForQury(allPostsModels, query){

	let filteredPostModels = allPostsModels.filter((post)=>{

		const normalizedPostTitle = post.title.toLocaleLowerCase();
		const normalizedQuery = query.toLocaleLowerCase();

		const titleIncludes =  normalizedPostTitle.includes(normalizedQuery);						
		return titleIncludes;

	});

	return filteredPostModels;

}