# EnvTransform

---

**A task to perform variable replacement for environment files**

---

## YAML Snippet

```yaml
- task: EnvTransform@0
  inputs:
    mode: replace #Mode to process variables for
    inputType: file #Input source for file structure
    content: #.env file contents. Required when `inputType = inline`
    inputFile: .env #Input file to perform transformation on.  Required when `inputType = file`
    outputFile: .env #File to write transformed values to
    preserveComments: false #Preserve comments when reading and writing files

```

## Arguments

| Argument                                   | Description                                                                                                           |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `mode` <br />Mode                          | **(Optional)** Mode to process variables for <br /> Options: `replace`, `substitute` <br /> Default value: `replace`  |
| `inputType` <br />Input Mode               | **(Required)** Input source for file structure <br /> Options: `file`, `inline` <br /> Default value: `file`          |
| `content` <br />Content                    | **(Optional)** .env file contents. Required when `inputType = inline` <br />                                          |
| `inputFile` <br />Input File               | **(Optional)** Input file to perform transformation on. Required when `inputType = file` <br /> Default value: `.env` |
| `outputFile` <br />Output File             | **(Optional)** File to write transformed values to <br /> Default value: `.env`                                       |
| `preserveComments` <br />Preserve Comments | **(Optional)** Preserve comments when reading and writing files <br />                                                |


## Examples

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


### Replace - Input File

Given the following pipeline configuration

```yaml
variables:
  PROJECT_NAME: '$(Build.Repository.Name)'
  API_URL: 'http://localhost:3000/api'
  API_KEY: 'key-1234-ddd'
  ENV: 'prod'
steps:
  - task: EnvTransform@0
    displayName: 'Replace values in files'
    inputs:
      inputType: 'file'
      inputFile: '$(Build.SourcesDirectory)/.env.example'
      outputFile: '$(Build.ArtifactStagingDirectory)/.env'
```

where, `.env.example` contains the values

```ini
ENV=debug
PROJECT_NAME="Local Name"
#This is a comment

API_URL = http://localhost:5000/api
NO_REPLACE = 'some content'
API_KEY=none
#COMMENT=1

```

it will produce the following `.env` file

```ini
ENV=prod
PROJECT_NAME=repo-name
API_URL=http://localhost:3000/api
NO_REPLACE='some content'
API_KEY=key-1234-ddd
```


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

