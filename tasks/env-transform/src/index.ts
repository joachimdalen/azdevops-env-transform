import tl = require('azure-pipelines-task-lib/task');

import { EnvTransformer } from './operations/EnvTransform';
import { TransformOptions } from './operations/TransformOptions';
import { stringify } from './utils/EnvParser';
import VariableResolver from './utils/VariableResolver';

async function run(): Promise<void> {
  try {
    const inputType = tl.getInput('inputType');
    const options: TransformOptions = {
      errorLogger: tl.error,
      infoLogger: console.log,
      getVariable: tl.getVariable,
      inputPath: tl.getPathInput('inputFile', inputType === 'file', inputType === 'file'),
      content: tl.getInput('content', inputType === 'inline'),
      mode: tl.getInput('mode') as any,
      outputPath: tl.getPathInput('outputFile', true),
      preserveComments: tl.getBoolInput('preserveComments')
    };

    const tansformer = new EnvTransformer(options);
    const transformedValues = await tansformer.transform();
    const transformedString = stringify(transformedValues);

    const filePath = VariableResolver.resolveVariables(options.outputPath, tl.getVariable);

    console.log('Writing transformed values to file: ' + filePath);
    tl.writeFile(filePath, transformedString);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
