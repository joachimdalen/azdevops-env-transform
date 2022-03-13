### Replace - Inline

Given the following pipeline configuration

```yaml
variables:
  PROJECT_NAME: '$(Build.Repository.Name)'
  API_URL: 'http://localhost:3000/api'
  API_KEY: 'key-1234-ddd'
  ENV: 'prod'
steps:
  - task: EnvTransform@0
    displayName: 'Replace values from inline content'
    inputs:
      inputType: 'inline'
      content: |
        ENV=debug
        PROJECT_NAME="Local Name"
        #This is a comment

        API_URL = http://localhost:5000/api
        NO_REPLACE = 'some content'
        API_KEY=none
        #COMMENT=1
      outputFile: '$(Build.ArtifactStagingDirectory)/.env'
```

it will produce the following `.env` file

```ini
ENV=prod
PROJECT_NAME=repo-name
API_URL=http://localhost:3000/api
NO_REPLACE='some content'
API_KEY=key-1234-ddd
```
