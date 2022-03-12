import * as fs from 'fs';
import { promisify } from 'util';

import { parse } from '../utils/EnvParser';
import VariableResolver from '../utils/VariableResolver';
import { EnvEntry } from './EnvEntry';
import { TransformOptions } from './TransformOptions';
const fstat = promisify(fs.readFile);

export class EnvTransformer {
  private _options: TransformOptions;
  constructor(options: TransformOptions) {
    this._options = options;

    if (!options.errorLogger) this._options.errorLogger = console.error;
    if (!options.infoLogger) this._options.infoLogger = console.log;
  }

  public async transform(): Promise<EnvEntry[]> {
    let result: EnvEntry[] = [];
    const entries: EnvEntry[] = await this.parseFromContent();

    if (this._options.mode == 'replace') {
      result = this.replace(entries);
    } else {
      result = this.subsitute(entries);
    }

    return result;
  }

  public async parseFromContent(): Promise<EnvEntry[]> {
    const { content, inputPath, preserveComments } = this._options;
    let entries: EnvEntry[] = [];
    if (content) {
      entries = parse(content, preserveComments);
    } else if (inputPath) {
      const fileContent = await fstat(inputPath);
      entries = parse(fileContent.toString(), preserveComments);
    } else {
      throw new Error('content or inputPath is required');
    }
    return entries;
  }

  private replace(entries: EnvEntry[]): EnvEntry[] {
    const { getVariable, infoLogger } = this._options;
    const replaced: EnvEntry[] = [];
    for (const entry of entries) {
      if (entry.comment !== undefined) {
        replaced.push(entry);
        continue;
      }

      const variableValue = getVariable(entry.key);
      if (variableValue === '' || variableValue === undefined) {
        replaced.push(entry);
        infoLogger(`Variable ${entry.key} not found`);
      } else {
        entry.value = variableValue;
        replaced.push(entry);
        infoLogger(`Replaced variable ${entry.key}`);
      }
    }
    return replaced;
  }

  private subsitute(entries: EnvEntry[]): EnvEntry[] {
    const { getVariable, infoLogger } = this._options;
    const replaced: EnvEntry[] = [];
    for (const entry of entries) {
      if (entry.comment) {
        replaced.push(entry);
        continue;
      }

      const newVal = VariableResolver.resolveVariables(entry.value, getVariable);
      infoLogger(`Substituting for ${entry.key}`);
      entry.value = newVal;
      replaced.push(entry);
    }
    return replaced;
  }
}
