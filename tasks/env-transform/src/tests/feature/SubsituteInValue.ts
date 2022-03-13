import * as tmrm from 'azure-pipelines-task-lib/mock-run';
import * as path from 'path';

const taskPath = path.join(__dirname, '../..', 'index.js');
const tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

const inputFile = `
ENV=$(Environment)
#This is a comment

API_URL = $(Api.BaseUri)
NO_REPLACE = Ok
LOG_LEVEL=
#COMMENT=1
`;
process.env['API_BASEURI'] = 'http://localhost:2000';
process.env['LOG_LEVEL'] = 'debug';
process.env['ENVIRONMENT'] = 'Prod';
process.env['MYVAR'] = 'No_replace_value';

tr.setInput('outputFile', '/feature/.env');
tr.setInput('content', inputFile);
tr.setInput('mode', 'substitute');
tr.setInput('inputType', 'content');

tr.run();
