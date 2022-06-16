<a  href="https://www.twilio.com">
<img  src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg"  alt="Twilio"  width="250"  />
</a>

# Web Chat Agent Assist using Dialogflow

A plugin to monitor the chat in Flex to parse customer responses and forward them to a Twilio function utilizing the Google Dialogflow API. The payload returned from Dialogflow is then used to match the inferred intent of the customer message to a category of pre-canned responses for the Agent.

---

## Functionality Overview

### Technical Components

- **Twilio Serverless Function** - used to orchestrate the API requests to Google Dialogflow
- **Google Dialogflow** - given a message (text), NLP processing determines the intent of the message
- **Google Cloud Platform** - houses the service account credentials to perform authenticated API calls to Google Dialogflow from the Twilio Function
- **Redux** - used to store and perform async logic to retrieve list of pre-canned responses and NLP results from Google Dialogflow

### NLP Query Workflow Diagram

<img  src="./readme_assets/nlp-diagram.png"  alt="Twilio"  width="100%"  />

---

## Setup

### Requirements

To deploy this function, you will need:

- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project") to create one.
- [Google Dialogflow Agent](https://dialogflow.cloud.google.com/) and access to the [Google Cloud Platform](https://cloud.google.com/)
- npm version 6.0.0 or later installed (type `npm -v` in your terminal to check)
- Node.js version 14 (type `node -v` in your terminal to check)
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Flex CLI Plugin](https://github.com/twilio-labs/plugin-flex) and the [Serverless Plugin](https://github.com/twilio-labs/serverless-toolkit/tree/main/packages/plugin-serverless). Run the following commands to install them:
  ```bash
  # Install the Twilio CLI
  npm install twilio-cli -g
  # Install the Serverless and Flex as Plugins
  twilio plugins:install @twilio-labs/plugin-serverless
  twilio plugins:install @twilio-labs/plugin-flex
  ```

### Twilio Account Settings

Before we begin, we need to collect all the config values we need to run this Flex plugin:

| Config&nbsp;Value | Description                                                                                                                          |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| Account&nbsp;Sid  | Your primary Twilio account identifier - find this [in the Console](https://www.twilio.com/console).                                 |
| Auth Token        | Used to create an API key for future CLI access to your Twilio Account - find this [in the Console](https://www.twilio.com/console). |

---

## Plugin Details

The Web Chat Agent Assist plugin is comprised of two custom components combined with Redux to fetch, store, and display data asynchronously. The `HiddenTaskListItem` and `CannedResponses` components are tied into the same Redux state, which allows for convenient access to all data that needs to be populated into the UI.

### Hidden Task List Item

This component is responsible for identifying new messages from the customer and forwarding the body of the message to a Twilio Function that returns the NLP data (intent, sentiment, etc.) from Google Dialogflow.

When the plugin is loaded, this component mounts to the `TaskListItem`, which inherits props related to the task and chat channel information. There is no UI for this component.

The core logic for processing the messages within the chat channel happens within the `componentDidUpdate()` method, which is only available to React Class components. This method is fired everytime the component updates, which can occur if new props have been provided by a parent component or an internal state has been changed.

For further technical implementation details, please see `./src/components/HiddenTaskListItem/HiddenTaskListItem.tsx`.

### Canned Responses Component

This component will replace the `CRM Panel` in Flex with a view that contains two sections:

- **Agent Assist** - the location for Google Dialogflow intent information and matching responses for the category matched to the identified intent of the customer message. If no category of the canned responses matches the intent returned from Dialogflow, no suggested responses will be shown.
- **Canned Chat Responses** - a list (broken out by category) of all canned chat responses, which are fetched from the Twilio Function.

Under each response, there is a `Send` button that will automatically send the response to the customer, and an `Insert` button that will place the text in the chat input field.

<img  src="./readme_assets/crm-panel.png"  alt="CRM Panel"  width="800"  />

---

### Google Dialogflow

Starting with the Google Dialogflow agent, we need to create a new agent and do some initial configuration of intents.

1. Navigate to https://dialogflow.cloud.google.com/

2. Login.

3. Click on the cog on the left, and then click on create a new agent.

<img  src="https://twilio-cms-prod.s3.amazonaws.com/images/Screenshot_2022-04-21_at_13.36.01.width-500.png"  alt="Twilio"  width="250" />

4. Give it a name, set the default time zone and press create.

5. It should take a few seconds to create the agent. Next, let's build a couple intents:

   #### Sales Intent

   <img  src="./readme_assets/sales-intent.png"  alt="Twilio"  width="100%"  />

   #### Support Intent

   <img  src="./readme_assets/support-intent.png"  alt="Twilio"  width="100%"  />

6. We now have our agent configured with a couple intents that match up to the categories in our canned responses. We will need a Google service account to access the agent via API. To set this up, navigate to the general agent options by clicking on the cog once again. Make sure you make a note of your project id, as you will need it later.

<img  src="https://twilio-cms-prod.s3.amazonaws.com/images/Screenshot_2022-04-21_at_13.58.55.width-1600.png"  alt="Twilio"  width="800" />

### Google Cloud Platform

You've now created the agent on the Dialogflow console and clicked on the project ID to navigate to the GCP console.

To allow our Twilio Function to perform authenticated API requests to Dialogflow, we will need a service account. We can create these via the GCP console by following this procedure:

1. Click on the Navigation Menu on the top left, and under "IAM and Admin", click on "Service Accounts":

<img  src="https://twilio-cms-prod.s3.amazonaws.com/images/Screenshot_2022-04-21_at_14.14.54.width-500.png"  alt="Twilio"  width="300" />

2. Click on the create service account on the top, fill in the form, and then click “Create and Continue”:

<img  src="https://twilio-cms-prod.s3.amazonaws.com/images/Screenshot_2022-04-21_at_14.19.10.width-1000.png"  alt="Twilio"  width="300" />

3. Click on "Select a role", pick "Dialogflow Service Agent", then press "Continue", and finally press"Done" to complete this process.The account should look something like this:

<img  src="https://twilio-cms-prod.s3.amazonaws.com/images/Screenshot_2022-04-21_at_14.24.04.width-1600.png"  alt="Twilio"  width="600" />

4. Finally, click on the three dots under "Actions" then "Manage Keys", click on "Add Key" then "Create New Key". Pick a JSON type key and press “Create”. Your browser will download a JSON file automatically. We will use this JSON file within our Twilio Function in the following section.

## Local Development

After the above requirements have been met:

1. Clone this repository.

   ```bash
   git clone git@github.com:mschmitt19/plugin-web-chat-agent-assist.git
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Rename and create the `appConfig.js` file:

   ```bash
   cd public && cp appConfig.example.js appConfig.js
   ```

4. [Deploy your Twilio Function](#twilio-serverless-deployment).

5. Run the application.

   ```bash
   twilio flex:plugins:start
   ```

6. Navigate to [http://localhost:3000](http://localhost:3000).

### Twilio Serverless deployment

You need to deploy the function associated with the Web Chat Agent Assist plugin to your Flex instance. The function is called from the plugin you will deploy in the next step and returns either:

- A JSON payload containing the chat response options (`/chat-responses`)
- A JSON payload of the inferred intent from Google Dialogflow (`/gdf-bot`)

For further information on the technical functionality, please review `./functions/functions/chat-responses.js` and `./functions/functions/gdf-bot.js`.

#### Pre-deployment Steps

1. Change into the functions directory, install package dependencies, and then rename `.env.example`.

   ```bash
   # Install required dependencies
   npm install
   # Rename example env file
   cd functions && cp .env.example .env
   ```

2. Open `.env` with your text editor and set the environment variables mentioned in the file.

   ```
   TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   TWILIO_AUTH_TOKEN=9yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
   ```

3. Deploy the Twilio function to your account using the Twilio CLI:

   ```bash
   cd functions && twilio serverless:deploy

   # Example Output
   # Deploying functions & assets to the Twilio Runtime
   # ⠇ Creating 1 Functions
   # ✔ Serverless project successfully deployed

   # Deployment Details
   # Domain: https://web-chat-agent-assist-gdf-xxxxxx-dev.twil.io
   # Service:
   #    web-chat-agent-assist-gdf (ZSxxxx)
   # ..
   ```

4. Copy and save the domain returned when you deploy a function. You will need it in the next step.

If you forget to copy the domain, you can also find it by navigating to [Functions > API](https://www.twilio.com/console/functions/api) in the Twilio Console.

> Debugging Tip: Pass the `-l` or logging flag to review deployment logs.

### Flex Plugin Deployment

Once you have deployed the function, it is time to deploy the plugin to your Flex instance.

You need to modify the source file to mention the serverless domain of the function that you deployed previously.

1. In the main directory rename `.env.example`.

   ```bash
   cp .env.example .env
   ```

2. Open `.env` with your text editor and set the environment variables mentioned in the file.

   ```
   # Paste the Function deployment domain
   REACT_APP_SERVICE_FUNCTION_URL=https://web-chat-agent-assist-gdf-xxxxxx-dev.twil.io
   ```

3. When you are ready to deploy the plugin, run the following in a command shell:

   ```bash
   twilio flex:plugins:deploy --major --changelog "Initial Canned Chat Responses Plugin" --description "Pre-canned Chat Responses in Flex"
   ```

## View your plugin in the Plugins Dashboard

After running the suggested next step with a meaningful name and description, navigate to the [Plugins Dashboard](https://flex.twilio.com/admin/) to review your recently deployed and released plugin. Confirm that the latest version is enabled for your contact center.

You are all set to test the Web Chat Agent Assist plugin on your Flex application!

---

## Changelog

### 1.0.0

**June 14, 2022**

- Updated README with instructions and screenshots.

## Disclaimer

This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.
