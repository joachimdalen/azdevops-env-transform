### Subsititue - Inline

Given the following pipeline configuration

```yaml
variables:
  API_URL: 'http://localhost:3000/api'
  API_KEY: 'key-1234-ddd'
  ENV: 'prod'
steps:
  - task: EnvTransform@0
    displayName: 'Substitute values from inline content'
    inputs:
      inputType: 'inline'
      mode: 'substitute'
      content: |
        ENV=$(ENV)
        PROJECT_NAME=$(Build.Repository.Name)
        #This is a comment

        API_URL = http://localhost:5000/api
        NO_REPLACE = 'some content'
        API_KEY=$(API_KEY)
        #COMMENT=1
      outputFile: '$(Build.ArtifactStagingDirectory)/.env'
```

it will produce the following `.env` file

```ini
ENV=prod
PROJECT_NAME=repo-name
API_URL=http://localhost:5000/api
NO_REPLACE='some content'
API_KEY=key-1234-ddd
```

_Note, `API_URL` is defined in variables, but values to replace must be explicitly defined in the file itself with `$(VARIABLE)`_
