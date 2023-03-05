
import Parser from 'rss-parser';
const ogs = require('open-graph-scraper');

export interface Article {
    author: string;
    title: string;
    url: string;
    date: string;
    snippet: string;
    image: string;
}

export class Feeds {

    parser = new Parser();

    async getRecentArticles(url: string, limit = 1): Promise<Article[]> {
        let results: Article[] = [];

        // Use rss-parser to get latest articles published to
        // the blog feed at the given url.
        const feed = await this.parser.parseURL(url);
        for (const item of feed.items) {
            let image = '';
            let snippet = '';

            // Uses open-graph-scraper to fetch the meta tag identifying
            // a social share image and short description.
            await ogs({url: item.link, ogImageFallback: true})
                .then((data: any) => {
                    const { error, result, response } = data;
                    image = result.ogImage.url;
                    snippet = result.ogDescription;
                });

            results.push({
                'author': item.creator || '',
                'title': item.title || '',
                'url': item.link || '',
                'date': item.pubDate || '',
                'snippet': snippet,
                'image': image,
            });

            // Only return the number of articles up to limit
            // since feed lengths can vary.
            if (results.length >= limit) {
                break;
            }
        }

        return results;
    }



}