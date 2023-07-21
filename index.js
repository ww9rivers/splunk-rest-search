/**
 * Main module for splunk-fetch.
 */

import axios from 'axios';
import { Command } from 'commander';
import config from './etc/config.js';

class App extends Command {
	// constructor
	constructor () {
		super();
		super.usage("[options]")
			.option('-c, --config <string>', 'Specify an alternative config file', 'etc/config.js')
			.parse(process.argv);
		this.options = {
			headers: {
				Authorization: `Splunk ${config.token}`,
				Accept: "application/json"
			},
			params: {
				output_mode: 'json'
			}
		};
		this.rest_search = `https://${config.host}:${config.port||8089}/services/search/jobs`;
	}
	async check_job (jobId) {
		const url = `${this.rest_search}/${jobId}`;
		const response = await axios.get(url, this.options);
		if (response.status === 200) {
			return response.data;
		}
		throw new Error(response.statusText);
	}
	async fetch (jobId) {
		const url = `${this.rest_search}/${jobId}/results`;
		const response = await axios.get(url, this.options);
		if (response.status === 200) {
			return response.data;
		}
		throw new Error(response.statusText);
	}
	async run () {
		const searchQuery = config.job||'search *';

		// Create a search job
		const jobId = await this.search(searchQuery);
		console.log('jobId =', jobId, '\n');

		// Check the job status
		const jobStatus = await this.check_job(jobId);
		console.log('jobId =', jobStatus, '\n');

		// If the job is finished, fetch the results
		if (jobStatus.status === 'success') {
			const results = await this.fetch(jobId);

			// Save the results to a file
			const filename = config.output||'search-results.json';
			const file = await fs.writeFile(filename, JSON.stringify(results));

			console.log(`Search results saved to ${filename}`);
		}
	}
	async search (searchQuery) {
		const url = this.rest_search;
		const data = {
			search: searchQuery,
		};
		const response = await axios.post(url, data, this.options);
		if (response.status === 200) {
			return response.data;
		}
		throw new Error(response.statusText);
	}
}

(new App).run();