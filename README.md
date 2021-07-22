# Amplify Project with Lambda Function (and Layer) using Typescript

# Description
This project contains tan amplify project with one lambda function and one lambda layer.
The Lambda function and the Lambda Layer implements some hello world code in typescript.
When you deploy the app, npm scripts are triggered (as part of the amplify lifecycle hooks) and transpile the typescript to javascript.

Lambda Layer elements are accessible in the lambda function via /opt/.
Because this folder doesn't exist on your local machine, you need path mapping in the tsconfig.

# 1. Fast Installation

Install Amplify CLI globally
> npm install -g @aws-amplify/cli

Clone the Project, Install Dependencies and Deploy the Project
>git clone https://github.com/StefanV85/LambdaLayerWithTS.git
cd LambdaLayerWithTS
amplify init => assign an AWS profile for your account
npm install
cd ./amplify/backend/function
npm install
cd ../../..
amplify push


# 2. Step By Step Instruction for this project

## 2.1 Install Amplify CLI globally
> npm install -g @aws-amplify/cli
## 2.2 Create an Amplify Project
> amplify init

- Choose the project name
- Choose your AWS profile to link your AWS account

## 2.3 Create an Lambda Function
> amplify add function

* Select: Lambda function (serverless function)
* Answer the following Questions (e.g. Lambda Function Name)
* Select NodeJS as runtime
* Select "Hello World" as function template
* Select "No" for advanced Settings
* Select "No" for edit local Lambda function now
* Try out "amplify push" to  push the Lambda Function to your AWS account
* After successfully push, you can test the Lambda function in the AWS Management Console

## 2.4 Create Lambda Layer
>  amplify add function

* Choose layer name
* Choose runtime (e.g. NodeJS)
* Choose which AWS Accounts should have access to this layer (e.g. recommend "Specific AWS Accounts"):
* Enter your AWS Account ID

## 2.5 Reference the new layer to the existing Lambda function

>  amplify update function

* Choose Lambda function (serverless function)
* Select the existing Lambda Function
* Select "Lambda layers configuration"
* Select "yes" to enable Layers for this function
* select the existing Lambda layer
* select "no" for edit the local Lambda function now
* Try out "amplify push" to  push the Lambda Function to your AWS account
* After successfully push, you can see in the AWS Management Console, that the Lambda function references to the Lambda layer

## 2.6 Swith to Typescript
### 2.6.1 Install Typescript Modules
- Typescript should be handled in ./amplify/backend/function (one level over the function itself)
````
- cd ./amplify/backend/function
- npm init
- npm install typescript --save-dev
- npm install @types/node --save-dev
````

### 2.6.2 Change Lambda Code to Typescript
- Rename ./amplify/backend/function/**LambdaName**/src/index.js  to "index.ts"
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
- create ./amplify/backend/function/**LambdaName**/src/tsconfig.json
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

### 2.6.3 Introduce Typescript transpiling script
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
### 2.6.4 Optional: VSCode Build Task
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
* Try out "amplify push" to transpile and push the Lambda code to the cloud
* After pushing successfully you should see the transpiled javascript code in the AWS Management Console

### 2.6.5 Change Layercode to Typescript
- Create ./amplify/backend/function/**layerName**/opt/**Shared/Logger/Logger.ts**
````typescript
export class Logger {
  log(message: string) {
    console.log(message)
  }
}
````

### 2.6.6 Import layer code in the function code
In the Cloud, the layer code is accessable in the path /opt/
Because /opt/ doesn't exist locally, we introduce path mapping in tsconfig

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

**Remark** Pathmapping in tsconfig is sometime not considerred immediatly by the IDE. Maybe you have to restart your IDE.

### 2.6.7 Change ./amplify/backend/function/< LambdaName>/src/index.ts
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
* Try out "amplify push" to transpile and push the changes to the cloud
* Test your Lambda Code in the AWS Management Console.
