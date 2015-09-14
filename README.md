## Technical Choices

- **Style:** I blatantly stole the style, and many of the assets, of the Battle.net support page for this app.
- **View:** React
- **Model/Controller:** Redux
- **Additional:** 
	- **react-redux** is used for binding React components to the Redux store
	- **react-router** is used to control navigation around the site, and loading the appropriate React components 
	- **redux-thunk** redux middleware for processing actions at a later time.  Used for the lazy construction of API requests to be passed to api middleware based on cache expiry and other factors
	- **redux-logger** redux middleware for logging actions.  Absolutely indispensable.
	- **webpack with babel-loader** these packages were used so that I could leverage ES6 and native JSX code, and transpile+minify to ES5 for the browser

I chose to use **React** for this project as a view because I wanted to learn more about the workflow
of React, since I haven't worked in it all that extensively.  I also wanted to leverage ES6 syntax and features,
since it can help alleviate some of the common code-smells (callback hell especially) found in many modern
javascript applications.  **react-router** was a natural followup choice in order to provide navigation around
the site without having to roll my own solution.  This proved to be a little bit of trouble, as in the middle
of development on this app, they rolled out their 1.0.0 release candidate, and I was forced to learn the new
API on the fly, with less than adequate documentation.

I considered loading data on the fly and storing it in a global object, but it seemed sloppy, so my next
choice was to use **Redux**.  Of all the Flux implementations I looked at, it seemed to be one of the most
popular among people who sound smart, so I decided to give it a try.  It had a very steep learning curve, but
once I learned its workflow and constructed middleware to handle Stack Exchange API requests, I found it
very useful.  

The structure of the API middleware I used is based on the Redux "real-world" example they include
in their [repo](https://github.com/rackt/redux/tree/master/examples/real-world).
Redux allowed me to reliably fetch and cache Stack Exchange API requests and auth data, as well
as use **react-redux** to bind my components to the store, as well as the lifecycle of the store.

## Limitations / bugs (Mostly in SE's authentication flow)

The Stack Exchange API, and Javascript SDK especially, do NOT work in local testing, which
was a significant challenge.  In addition, even running a local web server, and creating an app
at stackapps with a domain of "localhost" seemed to break the authentication flow, and the
popup would hang on the return URL without calling the callback in the original window.  This 
forced me to do most of my authenticated page testing by pushing to github and waiting for a refresh.

There is a bug in the stack exchange API that I ran into:
http://stackapps.com/questions/3631/bug-in-the-stackexchange-api-getting-could-not-parse-proxy-url-when-user-not

Also, the call to authenticate, in Firefox, has an issue where the action fired on the 
Redux store doesn't seem to be happening synchronously as part of the click event, so
the popup is getting blocked.  In Chrome it seems to be ok.  Given more time I'd fix it
by putting the call to `window.SE.authenticate` directly in the click handler, but that
would require a restructing of Redux actions and could take a while to figure out the "best"
way to handle it.

Upvoting, downvoting, and favoriting via the API seems to be broken
http://stackoverflow.com/questions/32281960/option-preflight-to-stackexchange-api-responds-with-bad-request