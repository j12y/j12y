
import { Octokit } from 'octokit';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
const { graphql } = require("@octokit/graphql");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export class GitHub {
    graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    });

    // GET /graphql
    // https://docs.github.com/en/graphql
    async getQueryResult(query: string): Promise<string> {
        const { repository } = await this.graphqlWithAuth(query);
        return repository;
    }

    async getReposDates(): Promise<string> {
        return this.getQueryResult(`
            { 
                repository(name: "j12y", owner: "j12y") { 
                    createdAt, updatedAt 
                }
            }
        `);
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
    async getReposInfo(user: string, repo: string): Promise<RestEndpointMethodTypes['repos']['get']['response']['data']> { 
        const { data } = await octokit.rest.repos.get({
            owner: user,
            repo: repo
        });

        return data;
    };


}



/*

export async function getReposMetrics(user: string, repo: string): Promise<RestEndpointMethodTypes['repos']['getViews']['response']['data']> {
    const { data } = await octokit.rest.repos.getViews({
        owner: user,
        repo: repo
    });

    return data;
}

export async function getReposTags(user: string, repo: string): Promise<RestEndpointMethodTypes['repos']['listTags']['response']['data']> {
    const { data } = await octokit.rest.repos.listTags({
        owner: user,
        repo: repo
    });

    return data;
}

export async function getReposTopics(user: string, repo: string): Promise<RestEndpointMethodTypes['repos']['getAllTopics']['response']['data']> {
    const { data } = await octokit.rest.repos.getAllTopics({
        owner: user,
        repo: repo
    });

    return data;
}

export async function getUserFollowers(user: string): Promise<RestEndpointMethodTypes['users']['listFollowersForUser']['response']['data']> {
    const { data } = await octokit.rest.users.listFollowersForUser({
        username: user
    });

    return data;
}

*/


