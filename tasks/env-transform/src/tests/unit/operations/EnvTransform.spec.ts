import { expect } from 'chai';

import { EnvTransformer } from '../../../operations/EnvTransform';
import { TransformOptions } from '../../../operations/TransformOptions';

const inputFile = `
ENV=debug
#This is a comment

API_URL = 12345
NO_REPLACE = Ok
#COMMENT=1
 # comment 2
`;

const variables = [
  { name: 'ENV', value: 'production', secret: false },
  { name: 'API_URL', value: 'http://localhost/api', secret: false }
];

describe('EnvTransform', async () => {
  it('replaces values correctly', async () => {
    const configOptions: TransformOptions = {
      content: inputFile,
      getVariable: (name: string) => {
        return variables.find(x => x.name === name)?.value;
      },
      mode: 'replace'
    };
    const sut = new EnvTransformer(configOptions);
    const result = await sut.transform();

    expect(result[0].value).to.be.equal('production');
    expect(result[1].value).to.be.equal('http://localhost/api');
    expect(result[2].value).to.be.equal('Ok');
  });

  it('replaces values correctly with comments enabled', async () => {
    const configOptions: TransformOptions = {
      content: inputFile,
      getVariable: (name: string) => {
        return variables.find(x => x.name === name)?.value;
      },
      mode: 'replace',
      preserveComments: true
    };
    const sut = new EnvTransformer(configOptions);
    const result = await sut.transform();

    expect(result[0].value).to.be.equal('production');
    expect(result[1].comment).to.be.equal('#This is a comment');
    expect(result[2].value).to.be.equal('http://localhost/api');
    expect(result[3].value).to.be.equal('Ok');
    expect(result[4].comment).to.be.equal('#COMMENT=1');
    expect(result[5].comment).to.be.equal(' # comment 2');
  });
});
