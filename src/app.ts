
import dotenv from 'dotenv';

import path from 'path';
import { Liquid } from 'liquidjs'
import { writeFileSync } from 'fs';

import { GitHub } from "./gh";
import { Feeds } from "./rss";


export async function main() {
  dotenv.config();


  // Store dynamic data for templates
  let scope = {
    generated: new Date().toDateString(),
    supporter_count: 0,
    supporters: new Array<String>,
    gallery: new Array<String>,
    topics: new Array<[String, Number]>,
    languages: new Array<[String, Number]>,
    medium_post: {},
    devto_post: {},
    dolbyio_post: {},
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

  // Gather influence metrics and unique topics
  var supporters: {[id: string]: number } = {};
  var topics: {[id: string]: number } = {};
  var languages: {[id: string]: number } = {};
  var gallery: {[id: string]: any } = {};

  for (let repo of repos.user.repositories.edges) {
    // Count occurrences for each stargazer
    repo.node.stargazers.edges.forEach((stargazer: any) => {
      supporters[stargazer.node.login] = stargazer.node.login in supporters ? supporters[stargazer.node.login] + 1 : 1;
    });

    // Count occurrences of each topic
    repo.node.repositoryTopics.edges.forEach((topic: any) => {
      if (topic.node.topic.name == 'github-gallery') {
        gallery[repo.node.name] = repo;
      } else {
        topics[topic.node.topic.name] = topic.node.topic.name in topics ? topics[topic.node.topic.name] + 1 : 1;
      }
    });

    // Count and include count of language used
    if (repo.node.primaryLanguage) {
      languages[repo.node.primaryLanguage.name] = repo.node.primaryLanguage.name in languages ? languages[repo.node.primaryLanguage.name] + 1 : 1;
    }
  }

  // Add followers as supporters, which could include people who are also
  // stargazers, so will gather in same dictionary to find unique set
  for (let follower of profile.user.followers.edges) {
    supporters[follower.node.login] = follower.node.login in supporters ? supporters[follower.node.login] + 1 : 1;
  }

  scope['follower_count'] = profile.user.followers.totalCount;
  scope['stargazer_count'] = Object.keys(supporters).length;
  scope['supporters'] = Object.keys(supporters);
  scope['supporter_count'] = Object.keys(supporters).length;

  // Share topics sorted by frequency of use for filtering repositories
  // from the organization
  scope['topics'] = Object.entries(topics).sort(function (first, second) {
    return second[1] - first[1];
  });
  scope['languages'] = Object.entries(languages).sort(function (first, second) {
    return second[1] - first[1];
  });

  // Gather topics across repos
  scope['gallery'] = Object.values(gallery);

  // Get blog post feeds
  const feeds = new Feeds();

  let feed_url = `https://${process.env.MEDIUM_ID}.medium.com/feed`;
  const medium = await feeds.getRecentArticles(feed_url);
  scope['medium_post'] = medium[0];

  feed_url = `https://dev.to/feed/${process.env.DEVTO_ID}`;
  const devto = await feeds.getRecentArticles(feed_url);
  scope['devto_post'] = devto[0];

  feed_url = `https://dolby.io/blog/author/${process.env.DOLBYIO_ID}/feed/`;
  const dolbyio = await feeds.getRecentArticles(feed_url);
  scope['dolbyio_post'] = dolbyio[0];

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