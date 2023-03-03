
import { Octokit } from 'octokit';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
const { graphql } = require("@octokit/graphql");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export class GitHub {
    // https://docs.github.com/en/graphql
    graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    });

    // GET /graphql
    // Fetch repository overview details
    // TODO: codegen from schema return type instead of any
    async getReposOverview(name: string): Promise<any> {
        const query = `
            query getReposOverview($name: String!) {
                user(login: $name) {
                    repositories(first: 100 ownerAffiliations: OWNER) {
                        totalCount
                        edges {
                            node {
                                name
                                url
                                description
                                openGraphImageUrl
                                repositoryTopics(first: 100) {
                                    edges {
                                        node {
                                            topic {
                                                name
                                            }
                                        }
                                    }
                                }
                                primaryLanguage {
                                    name
                                }
                                stargazerCount
                                stargazers(first: 100) {
                                    totalCount
                                    edges {
                                        node {
                                            login
                                            name
                                            email
                                        }
                                    }
                                }
                                forkCount
                            }
                        }
                    }
                }
            }
        `;
        const params = {'name': name};

        return await this.graphqlWithAuth(query, params);
    }

    // GET /graphql
    // Fetch user profile details indicating influence
    // TODO: codegen from schema return type instead of any
    async getProfileOverview(name: string): Promise<any> {
        const query = `
            query getProfileOverview($name: String!) { 
                user(login: $name) { 
                    followers(first: 100) {
                        totalCount
                        edges {
                            node {
                                login
                                name
                                twitterUsername
                                email
                            }
                        }
                    }
                }
            }
        `;
        const params = {'name': name};

        return await this.graphqlWithAuth(query, params);
    }


    // GET /graphql
    // Fetch repository create and updated dates
    // TODO: codegen from schema return type instead of any
    async getReposDates(name: string, owner: string): Promise<any> {
        const query = `
            query getReposDates($name: String!, $owner: String!) { 
                repository(name: $name, owner: $owner) { 
                    createdAt, updatedAt 
                }
            }
        `;
        const params = {'name': name, 'owner': owner };

        return await this.graphqlWithAuth(query, params);
    }

    // GET /users/{user}
    // https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user
    async getUserDetails(user: string): Promise<RestEndpointMethodTypes['users']['getByUsername']['response']['data']> {
        const { data } = await octokit.rest.users.getByUsername({
            username: user
        });

        return data;
    };

    // GET /repos/{owner}/{repos}
    // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
    async getReposInfo(owner: string, repo: string): Promise<RestEndpointMethodTypes['repos']['get']['response']['data']> { 
        const { data } = await octokit.rest.repos.get({
            owner: owner,
            repo: repo
        });

        return data;
    };

    // GET /repos/{owner}/{repo}/traffic/views
    // https://docs.github.com/en/rest/metrics/traffic?apiVersion=2022-11-28#get-page-views
    async getReposMetrics(user: string, repo: string): Promise<RestEndpointMethodTypes['repos']['getViews']['response']['data']> {
        // Get data by week instead of default day
        const { data } = await octokit.rest.repos.getViews({
            owner: user,
            repo: repo,
            per: 'week'
        });

        return data;
    }

    // GET /repos/{owner}/{repo}/tags
    // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-tags
    async getReposTags(owner: string, repo: string): Promise<RestEndpointMethodTypes['repos']['listTags']['response']['data']> {
        const { data } = await octokit.rest.repos.listTags({
            owner: owner,
            repo: repo
        });

        return data;
    }

    // GET /repos/{owner}/{repos}/topics
    // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-all-repository-topics
    async getReposTopics(owner: string, repo: string): Promise<RestEndpointMethodTypes['repos']['getAllTopics']['response']['data']> {
        const { data } = await octokit.rest.repos.getAllTopics({
            owner: owner,
            repo: repo
        });

        return data;
    }

    // GET /users/{username}/followers
    // https://docs.github.com/en/rest/users/followers?apiVersion=2022-11-28#list-followers-of-a-user
    async getUserFollowers(user: string): Promise<RestEndpointMethodTypes['users']['listFollowersForUser']['response']['data']> {
        const { data } = await octokit.rest.users.listFollowersForUser({
            username: user
        });

        return data;
    }
}



