
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
    fan_count: 0,
    fans: new Array<String>,
    follower_count: 0,
    stargazer_count: 0,
    public_repos: 0,
    profile_traffic: 0
  }

  // Get dynamic data from GitHub
  const gh = new GitHub();
  const user: string = process.env.USERNAME || '';

  const repos = await gh.getReposOverview(user);
  const profile = await gh.getProfileOverview(user);
  // console.log(JSON.stringify(repos, null, 2));

  // Gather influence metrics
  var fans: {[id: string]: number } = {};

  // Any stargazers of owned repositories count as a fan.
  for (let repo of repos.user.repositories.edges) {
    repo.node.stargazers.edges.forEach((stargazer: any) => {
      fans[stargazer.node.login] = stargazer.node.login in fans ? fans[stargazer.node.login] + 1 : 1;
    });
  }
  scope['stargazer_count'] = Object.keys(fans).length;

  // Add followers as fans, which could include people who are also
  // stargazers, so will gather in same dictionary to find unique set
  for (let follower of profile.user.followers.edges) {
    fans[follower.node.login] = follower.node.login in fans ? fans[follower.node.login] + 1 : 1;
  }
  scope['follower_count'] = profile.user.followers.totalCount;

  scope['fans'] = Object.keys(fans);
  scope['fan_count'] = Object.keys(fans).length;

  // TODO: Build repository gallery
  scope['public_repos'] = repos.user.repositories.totalCount;

  const repo: string = process.env.REPO || '';
  let metrics = await gh.getReposMetrics(user, repo);
  scope['profile_traffic'] = metrics.uniques;

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