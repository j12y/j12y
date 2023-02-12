
import dotenv from 'dotenv';

import { Liquid } from 'liquidjs'
import { writeFileSync } from 'fs';
import path from 'path';

import { GitHub } from "./gh";


export async function main() {
  dotenv.config();

  // Populate dynamic data
  const user: string = process.env.USERNAME || '';
  const repo: string = process.env.REPO || '';

  let gh = new GitHub();
  // let user_details = await gh.getUserDetails(user);

  const scope = {
    generated: new Date().toDateString(),
  //  followers: user_details.followers,
  //  public_repos: user_details.public_repos
  }


  let result = await gh.getReposDates();
  console.log(result);
  return;

  // let repos_info = await gh.getReposInfo(user, repo);
  // console.log(repos_info.created_at);
  // console.log(repos_info.updated_at);

  // getReposMetrics();
  // getReposReferrers();
  // getReposTags();
  // getReposTopics();
  // getUserFollowers();


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


}


main();