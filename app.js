import express from 'express'
import path from 'path'
import template from './src/template'
import ssr from './src/server'
import data from './assets/data.json'

const app = express()

// Serving static files
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/media', express.static(path.resolve(__dirname, 'media')));

// hide powered by express
app.disable('x-powered-by');
// start the server
app.listen(process.env.PORT || 3000);

let initialState = {
  isFetching: false,
  apps: data
}

// server rendered home page
app.get('/', (req, res) => {
  // use react-dom/server to get the components string: '<div class="app-card">...</div>'
  const { preloadedState, content}  = ssr(initialState)

  // construct html string that includes script + components elements(server rendered)
  const response = template("Server Rendered Page", preloadedState, content)
  res.setHeader('Cache-Control', 'assets, max-age=604800')

  // send html to the browser
  res.send(response);
});

// Pure client side rendered page
app.get('/client', (req, res) => {
  // construct html string with scripts
  // js script will be requested in the browser to request data and render elements
  let response = template('Client Side Rendered page')
  res.setHeader('Cache-Control', 'assets, max-age=604800')
  res.send(response)
});
