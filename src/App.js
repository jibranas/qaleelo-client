import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAmazonContext } from "./Contexts/AmazonContext";
import Footer from "./components/Footer";
import Topic from "./components/Topic";
import Quiz from "./components/Quiz";
import Button from "./components/Button";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { BrowserRouter as Redirect } from "react-router-dom";
import "./App.css";
import MainSideNav from "./components/sidebar/MainSideNav";
import CourseMenuPage from "./components/landingPage/CourseMenuPage";
import CourseLandingPage from "./components/landingPage/CourseLandingPage";
import CourseStats from "./components/landingPage/CourseStats";
import LoginPage from "./components/userAuth/LoginPage";
import Logout from "./components/userAuth/Logout";
import LogoutMessage from "./components/userAuth/LogoutMessage";
import Lesson from "./components/Lesson";
import GetStarted from "./components/userAuth/GetStarted";
import WelcomeMessageOne from "./components/userAuth/WelcomeMessageOne";
import WelcomeMessageTwo from "./components/userAuth/WelcomeMessageTwo";
import WelcomeMessageThree from "./components/userAuth/WelcomeMessageThree";
import WelcomeMessageFour from "./components/userAuth/WelcomeMessageFour";
import LessonDemo from "./components/LessonDemo";
import WelcomeMessageFive from "./components/userAuth/WelcomeMessageFive";
import WelcomeMessageNotifications from "./components/userAuth/WelcomeMessageNotifications";
import WelcomeMessageCourses from "./components/userAuth/WelcomeMessageCourses";
import WelcomeMessageSeven from "./components/userAuth/WelcomeMessageSeven";
import { useHistory } from "react-router-dom";

// PrivateRoute prevents accessibilty of contents if the user is not logged in
const PrivateRoute = ({ component: Component, isLoggedIn, isTokenExpired, renewSession, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn && !isTokenExpired ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

function App() {
  // Initialize states
  // Contains code to check the state if user is logged in and to check for login expiration time
  const { courseTitleUserIsOn, entryStore, isDarkMode, setIsDarkMode } =
    useAmazonContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const history = useHistory();

  // Function to check if the token is expired
  const isTokenExpired = () => {
      return tokenExpiration && Date.now() > tokenExpiration;
  };

  useEffect(() => {
    // Check localStorage for authentication state and expiration time
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedTokenExpiration = localStorage.getItem('tokenExpiration');

    if (storedIsLoggedIn && storedTokenExpiration) {
      // If authentication state and expiration time are found, check if token is still valid
      const expirationTime = parseInt(storedTokenExpiration);
      if (expirationTime > Date.now()) {
        setIsLoggedIn(true);
        setTokenExpiration(expirationTime);
      } else {
        // Token has expired, clear localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('tokenExpiration');
      }
    }
  }, []);

  // Add a class to the body element based on the dark mode state
  document.body.className = isDarkMode ? "darkbody" : "lightbody";

  return (
    <div className="App">
      {/* Router and routes */}
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (isLoggedIn ? <CourseMenuPage /> : <GetStarted />)}
          />
          <Route
            path="/LoginPage"
            exact
            render={() =>
              isLoggedIn ? (
                <CourseMenuPage />
              ) : (
                <LoginPage setIsLoggedIn={setIsLoggedIn} setTokenExpiration={setTokenExpiration} />
              )
            }
          />

          <Route
            path="/WelcomeMessageOne"
            exact
            component={WelcomeMessageOne}
          />
          <Route
            path="/WelcomeMessageTwo"
            exact
            component={WelcomeMessageTwo}
          />
          <Route
            path="/WelcomeMessageThree"
            exact
            component={WelcomeMessageThree}
          />
          <Route
            path="/WelcomeMessageFour"
            exact
            component={WelcomeMessageFour}
          />
          <Route
            path="/WelcomeMessageFive"
            exact
            component={WelcomeMessageFive}
          />
          <Route
            path="/WelcomeMessageNotifications"
            exact
            component={WelcomeMessageNotifications}
          />
          <Route
            path="/WelcomeMessageSeven"
            exact
            component={WelcomeMessageSeven}
          />
          <Route
            path="/WelcomeMessageCourses"
            exact
            component={WelcomeMessageCourses}
          />
          <Route path="/LoginPage" exact component={LoginPage} />
          <Route path="/LessonDemo" exact component={LessonDemo} />

          {/* Protected Routes */}
          <PrivateRoute
            path="/CourseMenuPage"
            exact
            component={CourseMenuPage}
            isLoggedIn={isLoggedIn}
          />
          <PrivateRoute
            path="/:courseTitle/topic/:topicNumber"
            component={Topic}
            isLoggedIn={isLoggedIn}
          />
          <PrivateRoute
            path="/:courseTitle/quiz/:topicNumber"
            component={Quiz}
            isLoggedIn={isLoggedIn}
          />
          <PrivateRoute
            path="/:courseTitle/start"
            component={CourseLandingPage}
            isLoggedIn={isLoggedIn}
          />
          <PrivateRoute
            path="/:courseTitle/lesson/:lessonNumber"
            component={Lesson}
            isLoggedIn={isLoggedIn}
          />
          <Route
            path="/LogoutMessage"
            render={() => <LogoutMessage setIsLoggedIn={setIsLoggedIn} />}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
