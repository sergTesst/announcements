import React from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { PostsList } from "../components/Posts/PostList";
import classNames from "classnames";

function App() {
  return (
    <Router>
      <div className="wrapper" 
        style={{background:'#121212',	color: '#e1e1e1'	}}>
        <div className="App" >
          
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <div className="container-fluid m-0 p-0">
                  {/* <Navbar /> */}
                  <div className="container-sm">
                    
                    <div className="text">app will be here</div>

                    <div className="row">
                      <section 
                        className={classNames('order-sm-max-2 posts-list col-md-8 rounded')} 
                        style={{background:'#1d1d1d'}}>
                        <PostsList></PostsList>
                      </section>

                      <section className="order-sm-max-1 col-md-4 ">
                        {/* <AddPostForm></AddPostForm> */}
                      </section>
                    </div>
                  </div>
                </div>
              )}
            ></Route>

            <Redirect to="/" />
          </Switch>
        
        
        </div>
      </div>
    </Router>
  );
}

export default App;
