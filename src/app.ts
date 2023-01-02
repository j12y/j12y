
import dotenv from 'dotenv';
import { Liquid } from 'liquidjs'

dotenv.config();

const engine = new Liquid({
  root: __dirname,
  extname: '.liquid'
})

// TODO: lookup dynamic data

const scope = {
  message: 'Hello World'
}


// TODO: write file to disk
engine.renderFile('README', scope).then(console.log)



/*

import path from 'path';

*/
