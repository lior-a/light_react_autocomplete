# Answers

1. What is the difference between Component and PureComponent? give an
example where it might break my app.

The difference is that PureComponent is a React Component that implements ShouldComponentUpdate life cycle hook in such a way that it does a shallow comparison of state and props. If nothing changed then the component does not re-render

it can break the app in case of a more complicated data structure which will result with components not rendering when it should.

2. Context + ShouldComponentUpdate might be dangerous. Can think of why
is that?
ShouldComponentUpdate can stop context propagation to child components.

3. Describe 3 ways to pass information from a component to its PARENT.
- a function that is called by the child and passed as a prop to the child.
- a state manager like redux, mobx. The child has access to the global parent store.
- Updating React context by the child.

4. Give 2 ways to prevent components from re-rendering.
- using ShouldComponentUpdate can help determine if a component should render or be prevented.
- memoization of a component can prevent re-rendering of the same component.
- virtual DOM as a whole concept allows us behind the scenes to reduce redundant rendering of our components' view.

5. What is a fragment and why do we need it? Give an example where it might break my app.
React's fragments are useful to prevent rendering redundant html tags and help us to group together html tags. It's due to a limitation in which jsx requires a single node and couldn't deal with multiple arrays of node's to render. It might break our app for example when it comes down to styling, if we use "display: flex" on the parent of a component that has fragment, it can render the content unexpectedly horizontally. 


6. Give 3 examples of the HOC pattern.
HOC are part of compositional design patterns that help us reuse component logic.
- Redux connect helps us connect data between redux store and react components (allowing us to work with smart/dumb components).
- withRouter of react-router which accepts children then returns them.
- Styled Components

7. what's the difference in handling exceptions in promises, callbacks and async...await.
async/await: Error thrown in async function can be handled by wrapping await with try / catch:
try {
    await fail()
} catch (e) {
    console.log(e)
}

This syntax would be sugar coating for fail().catch(console.log)
async/await are also always asynchronous and use promises & generators under the hood. They make the code look synchronous.

callbacks: in callbacks in a promise using thrown to dispatch error can result with the error thrown to another call stack because the callback will be called at later stage in another call stack. which means that a wrapping try/catch might miss that error:
new Promise((resolve, reject) => {
    setTimeout(function() {
        throw new Error(); // will be missed by a wrapping try/catch due to a different call stack time execution 
    }, 1000);
});
Callbacks are the most flexible. They can be synchronous or asynchronous

Promises: in a promise we can use reject() to handle exceptions
new Promise((resolve, reject) => {
    reject(new Error());
});
and we can catch it with try/catch. promises are always asynchronous callbacks and have a strict flow -> from pending state to resolved/rejected.

bonus: we can handle unhandled rejections globally with the event: onunhandledrejection

8. How many arguments does setState take and why is it async.
set state receives 2 arguments, First is data object, Second is the callback to execute once setting the data is done. The reason of async nature of setState is because it buffers all the changes and executes them asynchronously using the last final state in each render cycle.

9. List the steps needed to migrate a Class to Function Component.
- convert all classes to functions.
- use React hooks instead of lifecycle methods (i.e, useEffect instead of componentDidMount/WillUnmount)
- work with immutable predictable data structures (like immutable.js or use immutable methods that don't change the data but create a new object.)
- change the development paradigm  (change from object oriented, using objects, inheritance, fields, procedures/methods to functional programming which is programs that are constructed by applying and composing functions, pure functions, declarative code, predictable state, functions as first-class citizens).

10.  List a few ways styles can be used with components.
- Inline style with style object.
- ClassName css class with style in a css/sass file.
- With 3rd party libraries like styled components.
- With 3rd party libraries like material UI, twitter bootstrap and others.

11.  How to render an HTML string coming from the server.
- with dangerouslySetInnerHTML - however as the name suggests, if we don't know where the HTML comes from (i.e from the user), It might be a security risk! so the HTML need to be stripped and cleaned from anything malicious (always server side but preferably also on the client). Security breaches can lead to XSS vulnerability, stealing identity with cookies, HTML injection and other security problems.
- It is possible to build a component that parses the HTML string, traverses through the tree of HTML nodes and safely render the incoming HTML.