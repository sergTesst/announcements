import React from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { Navbar } from "../components/NavBar/NavBar";

import { PostsList } from "../components/Posts/PostList";
import classNames from "classnames";

import { singlePostPath, editPostPath } from "../api/ApiRoutes";
import { SinglePost } from "../components/Posts/SinglePost";
import { AddPostForm } from "../components/Posts/AddPostForm";
import { EditPostWrapper } from "../components/Posts/EditPostForm";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <div className="App">
          <div className="container-fluid m-0 p-0">
            <Navbar />

            <div className="container-sm containerMarin" >
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <div className="row postContainer pt-4">

                      <section className="order-sm-max-2 posts-list col-md-8 rounded shadow">
                        <PostsList themeClasses="link-dark text-decoration-none"></PostsList>
                      </section>

                      <section className="order-sm-max-1 col-md-4 p-0">
                        <div
                          className={classNames(
                            "sticky-sm-top p-2 rounded  shadow addFormTop",
                            "infoPart"
                          )}
                        >
                          <AddPostForm></AddPostForm>
                        </div>
                      </section>
                    </div>
                  )}
                ></Route>

                <Route
                  exact
                  path={singlePostPath}
                  render={() => <SinglePost></SinglePost>}
                ></Route>

                <Route
                  exact
                  path={editPostPath}
                  render={() => (
                    <div className="row shadow infoPart">
                      <EditPostWrapper></EditPostWrapper>
                    </div>
                  )}
                ></Route>

                <Redirect to="/" />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
