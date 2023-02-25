
import dotenv from 'dotenv';

import path from 'path';
import { Liquid } from 'liquidjs'
import { writeFileSync } from 'fs';

import { GitHub } from "./gh";


export async function main() {
  dotenv.config();

  // Store dynamic data for templates
  let scope = {
    generated: new Date().toDateString(),
    followers: 0,
    public_repos: 0,
    uniques: 0
  }

  // Get dynamic data from GitHub
  const gh = new GitHub();
  const user: string = process.env.USERNAME || '';
  const repo: string = process.env.REPO || '';


  const repos = await gh.getReposOverview('j12y');
  // console.log(JSON.stringify(repos, null, 2));
  const profile = await gh.getProfileOverview('j12y');

  // Gather general numbers from REST API
  scope['followers'] = profile.user.followers.totalCount;
  scope['public_repos'] = repos.user.repositories.totalCount;

  // let metrics = await gh.getReposMetrics(user, repo);
  // scope['uniques'] = metrics.uniques;

  // Using liquid template engine to render files found in template dir
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
}

main();