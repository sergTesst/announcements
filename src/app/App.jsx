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

            <div className="container-sm" style={{ marginTop: "65px" }}>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => (
                    <div className="row">
                      <section
                        className={classNames(
                          "order-sm-max-2 posts-list col-md-8 rounded shadow"
                        )}
                        style={{ background: "#fefefe" }}
                      >
                        <PostsList themeClasses="link-dark text-decoration-none"></PostsList>
                      </section>

                      <section className="order-sm-max-1 col-md-4 ">
                        <div
                          className="sticky-sm-top rounded p-2 shadow"
                          style={{
                            background: "#fefefe",
                            top: "45px",
                          }}
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
                  render={() => (
                    <div
                      className="row shadow"
                      // style={{ background: "#1d1d1d" }}
                      style={{ background: "#fefefe" }}
                    >
                      <SinglePost></SinglePost>
                    </div>
                  )}
                ></Route>

                <Route
                  exact
                  path={editPostPath}
                  render={() => (
                    <div
                      className="row shadow"
                      style={{ background: "#fefefe" }}
                    >
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
