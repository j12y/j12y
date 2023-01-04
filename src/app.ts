
import dotenv from 'dotenv';
import { Liquid } from 'liquidjs'
import { writeFileSync } from 'fs';
import path from 'path';

dotenv.config();

// Populate dynamic data
// TODO: lookup dynamic data
const scope = {
  generated: new Date().toDateString(),
}

// Identify template location for engine
// Learn more: https://liquidjs.com/
const engine = new Liquid({
  root: path.resolve(__dirname, 'template/'),
  extname: '.liquid'
})

// Write the newly generated README file to disk
engine.renderFile('README', scope).then((content) => {
    writeFileSync(path.join(__dirname, '../README.md'), content, {
        flag: 'w'});
});

