
import dotenv from 'dotenv';
import { Liquid } from 'liquidjs'
import { writeFileSync } from 'fs';
import path from 'path';
import { Octokit } from 'octokit';

dotenv.config();


const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });



// Identify template location for engine
// Learn more: https://liquidjs.com/
const engine = new Liquid({
  root: path.resolve(__dirname, 'template/'),
  extname: '.liquid'
})

// Populate dynamic data
// TODO: lookup dynamic data
const scope = {
  generated: new Date().toDateString(),
}

// Write the newly generated README file to disk
engine.renderFile('README', scope).then((content) => {
    writeFileSync(path.join(__dirname, '../README.md'), content, {
        flag: 'w'});
});





