import * as tmrm from 'azure-pipelines-task-lib/mock-run';
import * as path from 'path';

const taskPath = path.join(__dirname, '../..', 'index.js');
const tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

const inputFile = `
ENV=debug
#This is a comment

API_URL = 12345
NO_REPLACE = Ok
#COMMENT=1
LOG_LEVEL=
`;
process.env['API_URL'] = 'http://localhost:2000';
process.env['ENV'] = 'Prod';
process.env['NO_REPLACE'] = 'No_replace_value';

tr.setInput('outputFile', '/feature/.env');
tr.setInput('content', inputFile);
tr.setInput('mode', 'replace');
tr.setInput('inputType', 'content');

tr.run();
