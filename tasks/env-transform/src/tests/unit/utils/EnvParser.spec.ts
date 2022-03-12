import { expect } from 'chai';

import { EnvEntry } from '../../../operations/EnvEntry';
import { parse, stringify } from '../../../utils/EnvParser';

const inputFile = `
ENV=debug
#This is a comment

API_URL = 12345
NO_REPLACE = Ok
#COMMENT=1
`;

describe('EnvParser', async () => {
  it('parses the correct amount of variables', async () => {
    const result = parse(inputFile);

    expect(result).to.have.length(3, 'Failed to parse all values');
  });
  it('parses values correctly', async () => {
    const result = parse(inputFile);

    expect(result[0]).to.deep.eq({ key: 'ENV', value: 'debug' });
    expect(result[1]).to.deep.eq({ key: 'API_URL', value: '12345' });
  });

  it('writes values correctly', async () => {
    const items: EnvEntry[] = [
      { key: 'API_URL', value: 'http://localhost:3200' },
      { key: 'ENV', value: 'production' }
    ];

    const written = stringify(items);

    expect(written).to.contain('API_URL=http://localhost:3200');
    expect(written).to.contain('ENV=production');
  });

  it('parses the correct amount of variables with comments enabled', async () => {
    const result = parse(inputFile, true);

    expect(result).to.have.length(5, 'Failed to parse all values');
  });

  it('parses values correctly with comments enabled', async () => {
    const result = parse(inputFile, true);

    expect(result[0]).to.deep.eq({ key: 'ENV', value: 'debug' });
    expect(result[1]).to.deep.eq({ key: undefined, comment: '#This is a comment' });
    expect(result[2]).to.deep.eq({ key: 'API_URL', value: '12345' });
  });

  it('writes values correctly with comments enabled', async () => {
    const items: EnvEntry[] = [
      { key: 'API_URL', value: 'http://localhost:3200' },
      { key: 'ENV', value: 'production' },
      { key: undefined, comment: '#This is my comment' }
    ];

    const written = stringify(items);

    expect(written).to.contain('API_URL=http://localhost:3200');
    expect(written).to.contain('ENV=production');
    expect(written).to.contain('#This is my comment');
  });

  it('parses entries where value is not set', async () => {
    const inputContent = `
    ENV=debug
    #This is a comment

    API_URL = 12345
    NO_REPLACE = Ok
    #COMMENT=1
    LOG_DIR=
    `;

    const result = parse(inputContent);

    expect(result).to.have.length(4, 'Failed to parse all values');
  });

  it('writes entries where value is not set', async () => {
    const items: EnvEntry[] = [
      { key: 'API_URL', value: 'http://localhost:3200' },
      { key: 'ENV', value: 'production' },
      { key: 'LOG_DIR', value: undefined },
      { key: undefined, comment: '#This is my comment' }
    ];

    const written = stringify(items);

    expect(written).to.contain('API_URL=http://localhost:3200');
    expect(written).to.contain('LOG_DIR=');
    expect(written).to.contain('#This is my comment');
    expect(written).not.to.contain('LOG_DIR=undefined');
  });
});
