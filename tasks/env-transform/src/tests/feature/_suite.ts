/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import { expect } from 'chai';
import * as path from 'path';

describe('EnvTransform Suite', function () {
  it('should replace variables given in content', function () {
    const taskPath = path.join(__dirname, 'ReplaceInContent.js');
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(taskPath);
    tr.run();

    if (!tr.succeeded) {
      console.log(tr.stdout);
    }

    expect(tr.stderr).to.be.empty;
    expect(tr.succeeded).to.be.true;
  });
  it('should substitute variables given in content', function () {
    const taskPath = path.join(__dirname, 'SubsituteInValue.js');
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(taskPath);
    tr.run();

    if (!tr.succeeded) {
      console.log(tr.stdout);
    }

    expect(tr.stderr).to.be.empty;
    expect(tr.succeeded).to.be.true;

    expect(tr.stdOutContained('Environment=Prod')).to.be.true;
    expect(tr.stdOutContained('Api.BaseUri=http://localhost:2000')).to.be.true;
    expect(tr.stdOutContained('Substituting for NO_REPLACE')).to.be.true;
  });
  it('should handle empty values in substitute', function () {
    const taskPath = path.join(__dirname, 'SubstituteEmptyValues.js');
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(taskPath);
    tr.run();

    if (!tr.succeeded) {
      console.log(tr.stdout);
    }
    expect(tr.stderr).to.be.empty;
    expect(tr.succeeded).to.be.true;

    expect(tr.stdOutContained('Api.BaseUri=http://localhost:2000')).to.be.true;
    expect(tr.stdOutContained('Substituting for NO_REPLACE')).to.be.true;
    expect(tr.stdOutContained('Substituting for LOG_DIR')).to.be.true;
  });
  it('should handle empty values in replace', function () {
    const taskPath = path.join(__dirname, 'ReplaceEmptyValues.js');
    const tr: ttm.MockTestRunner = new ttm.MockTestRunner(taskPath);
    tr.run();

    if (!tr.succeeded) {
      console.log(tr.stdout);
    }

    expect(tr.stderr).to.be.empty;
    expect(tr.succeeded).to.be.true;

    expect(tr.stdOutContained('Variable LOG_DIR not found')).to.be.true;
  });
});

function printLines(content: string): void {
  const lines = content.split('/n');

  for (let i = 0; i < lines.length; i++) {
    console.log(lines[i]);
  }
}
