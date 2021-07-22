# Amplify Project with Lambda Function (and Layer) using Typescript

## Create an Amplify Project
> amplify init

- Choose the project name
- Choose your aws profile to link your aws account

## Create an Lambda Function
> amplify add function

-- Select: Lambda function (serverless function)
-- Answer the following Questions (e.g. Lambda Function Name)
-- Select NodeJS as runtime
-- Select "Hello World" as function template
-- Select "No" for advanced Settings
-- Select "No" for edit local Lambda function now
-- Try out "amplify push" to  push the Lambda Function to your aws account
-- After successfully push, you can test the Lambda function in the aws console

## Create Lambda Layer
>  amplify add function

-- Choose layer name
-- Choose runtime (e.g. NodeJS)
-- Choose which AWS Accounts should have access to this layer (e.g. recommend "Specific AWS Accounts"):
-- Enter your AWS Account ID

## Reference the new layer to the existing Lambda function

>  amplify update function

-- Choose Lambda function (serverless function)
-- Select the existing Lambda Function
-- Select "Lambda layers configuration"
-- Select "yes" to enable Layers for this function
-- select the existing Lambda layer
-- select "no" for edit the local Lambda function now
-- Try out "amplify push" to  push the Lambda Function to your aws account
-- After successfully push, you can see in the aws console, that the Lambda function references to the Lambda layer

## Swith to Typescript
### Install Typescript Modules
- Typescript should be handled in ./amplify/backend/function (one level over the function itself)
````
- cd ./amplify/backend/function
- npm init
- npm install typescript --save-dev
- npm install @types/node --save-dev
````

### Change Lambda Code to Typescript
- Rename ./amplify/backend/function/< LambdaName>/src/index.js  to "index.ts"
- Enhance code with typescript hello world
```typescript
{
    exports.handler = async (event) => {
    let message: string = 'Hello, World!'
    console.log(message)

    const response = {
        statusCode: 200,
        body: JSON.stringify(message),
    }
    return response
    }
}
```
- create ./amplify/backend/function/<LambdaName>/src/tsconfig.json
```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "outDir": ".",
        "rootDir": ".",
        "sourceMap": true,
        "strict": false,
        "experimentalDecorators": true,
        "baseUrl": ".",
        "resolveJsonModule": true,
        "paths": {
        }
    },
    "exclude": []
}
```

### Introduce Typescript transpiling script
- Add package.json on root level of the project (if doesn't exist yet)
- npm init
- Add a Script for your Lambda Function: 
  "amplify:< LambdaFunctionName>"
- Because of the prefix **amplify:**, the script will be triggered automatically be the amplify cli
```json
{
  "name": "Lambdalayerwithts",
  "version": "1.0.0",
  "description": "Amplify Project with Lambda Functions/Layers using Typescript",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "amplify:LambdaFunc1": "cd amplify/backend/function && npm run tscLambdaFunc1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/StefanV85/LambdaLayerWithTS.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/StefanV85/LambdaLayerWithTS/issues"
  },
  "homepage": "https://github.com/StefanV85/LambdaLayerWithTS#readme"
}
```
- Add a corresponding script for your Lambda Function in ./amplify/backend/function/package.json
```json
{
  "name": "function",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "tscLambdaFunc1": "tsc -p ./LambdaFunc1/src/"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": {
    "@types/node": "^16.4.0",
    "typescript": "^4.3.5"
  }
}
```
### Optional: VSCode Build Task
Create an Build Task, to be able to trigger the transpile via Ctrl+Shift+B manually too
- create ./.vscode/tasks.json
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "LambdaFunc1 TypeScript->JavaScript",
      "type": "npm",
      "group": "build",
      "script": "amplify:LambdaFunc1",
      "problemMatcher": []
    }
  ]
}
```
-- Try out "amplify push" to transpile and push the Lambda code to the cloud
-- After pushing successfully you should see the transpiled javascript code in the aws console

### Change Layercode to Typescript
- Create ./amplify/backend/function/< layerName>/opt/**Shared/Logger/Logger.ts**
````typescript
export class Logger {
  log(message: string) {
    console.log(message)
  }
}
````

### Import layer code in the function code
- Configure Path Mapping in ./amplify/backend/function/LambdaFunc1/src/tsconfig.ts
````json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es6",
    "outDir": ".",
    "rootDir": ".",
    "sourceMap": true,
    "strict": false,
    "experimentalDecorators": true,
    "baseUrl": ".",
    "resolveJsonModule": true,
    "paths": {
      "/opt/Shared/Logger/Logger": [
        "../../lambdalayerwithtsLambdaLayer1/opt/Shared/Logger/Logger"
      ]
    }
  },
  "exclude": []
}
````
- Change ./amplify/backend/function/< LambdaName>/src/index.ts
``` typescript
// @ts-ignore
import { Logger } from '/opt/Shared/Logger/Logger'

exports.handler = async (event) => {
  let message: string = 'Hello, World!'
  Logger.log(message)

  const response = {
    statusCode: 200,
    body: JSON.stringify(message),
  }
  return response
}

````
-- Try out "amplify push" to transpile and push the changes to the cloud
-- Test your Lambda Code in the aws console.
