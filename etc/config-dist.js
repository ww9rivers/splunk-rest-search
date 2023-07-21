// Sample config file: Copy this to config.js
// and fill in appropriate values.
export default {
	// Exports of this module
	host: '<instance>.splunkcloud.com',
	port: 8089,
	job: '| inputcsv <search-results>.csv',
	output: '/tmp/outputs.csv',
	token: '<Splunk-token-set-up-on-the-host>'
}