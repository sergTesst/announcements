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


export default function makeServer(environment = "development") {
	return new Server({

		environment: environment,

		routes(){
			this.namespace = "/fakeApi";
			// const server = this;

			this.get("/posts", (schema, req) => {
        const { from, to } = req.requestHeaders;

        let allPosts = schema.posts.all();

        const resultPosts = allPosts.models.slice(from, to);

        return {
          posts: resultPosts,
          allPostsLength: allPosts.length,
        };
      });
		
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
          return faker.lorem.sentence();
        },
				description(){
					return faker.lorem.paragraphs();
				}
			})
		},
		serializers: {
      application: RestSerializer,

    },

		seeds(server){
			server.createList('post',10);
		}


	})
}