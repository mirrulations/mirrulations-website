# Mirrulations Website Repo
**Authors:** Seth Coleman, Davin Glynn, Trevor Gray, Nathan Hajel, Terrell Nelson, Giovanny Teran, and Brandon Yang

This repository contains the source code for the Mirrulations Project website. The Mirrulations Project aims to provide a user-friendly interface for searching and retrieving data from [regulations.gov](https://www.regulations.gov/). This website interacts with an AWS API Gateway to fetch and display data based on user input.

### <ins>**Start Up AWS Amplify:**</ins>
1. On [AWS](https://us-east-1.console.aws.amazon.com/console/home?region=us-east-1#) search for _**AWS Amplify**_.
2. When you select AWS Amplify, you will be brought to the [main page](https://us-east-1.console.aws.amazon.com/amplify). Click on _**Deploy an app**_.
3. Under _**Deploy your app**_, select _**GitHub**_.
    - Click _**Next**_.
4. There will be a window that pops up where you have to Authorize GitHub to work with Amplify. _**Allow it**_, and then you should be brought to the next screen.
5. In the _**Select a repository**_ box, find your repository. If you cannot find your repository, click on the _**Update GitHub permissions**_. If you are working in a different GitHub Organization you will have to allow Authorization to that Organization.
6. You will be brought to App Settings. Hit _**Next**_.
7. Check to make sure that everything is there, and hit _**Save and Deploy**_. It will start to create and deploy your Amplify App.
8. Once the domain is [registered](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/registrar-tld-list.html) through Route 53, go to the Amplify app, and select _**Hosting > Custom Domains**_. Then select the _**Add domain**_ in the top right corner.
9. The domain you are trying to deploy if it has been registered should autopopulate as an option, select the domain, and Configure the domain.
10. No changes need to be made, add domain, and wait. This process can take 5-15 minutes to complete. Now the domain is ready to be accessed. 

### <ins>**How To Get API Gateway Link Running On Own Device:**<ins>
- Log on to AWS and go to the [AWS Amplify console](https://us-east-1.console.aws.amazon.com/amplify/apps).
- Click on your app.
- On the sidebar on the left, click the down arrow on the right side on _**Hosting**_.
- Click on _**Environment variables**_.
- On the top right, there should be a button that says, _**Manage Variables**_. Click it.
- If there is already another environment variable, click _**+ Add new**_ at the bottom at the page.
- In the box underneath Variable, put `GATEWAY_API_URL`.
- Then, in the box underneath Value, put your `AWS API Gateway Link`.
- Click _**Save**_.
- Go back to your deployment and redeploy your application.
    - In the top left, next to the amplify logo, click _**All apps**_.
    - Click on your app.
    - Click on the branch that you want to redeploy.
    - In the top right corner, click _**↺ Redeploy this version**_.

### <ins>**How To Install A Vite Enviroment For Local Use:**</ins>
1. In the terminal, type: `npm install vite`.
    - If you get a error for npm, try `brew upgrade npm` and `brew cleanup` ([stackoverflow](https://stackoverflow.com/questions/53828891/dyld-library-not-loaded-usr-local-opt-icu4c-lib-libicui18n-62-dylib-error-run))
2. Make a _**.env**_ file:
    - Right click in your root directory.
    - Name it `.env`.
    - Inside put `VITE_GATEWAY_API_URL=<Your API GATEWAY LINK HERE>`.
        - For the current moment, this API link should be `http://localhost:3000/dummy`
3. To run locally type `npm run dev` and go to http://localhost:5500/.

### <ins>How To Create a Github Actions Workflow:</ins>

- It is important to note now and for the future that when making changes to github actions you must **push directly to upstream**.  This is typically bad practice but is required for github actions to work.  Need more information? Check out the  [Discord](https://discord.com/channels/1332506599020822620/1333536321515290646/1336078961943380030).
- Create a directory ./github/workflows in the main repository. 
- Create a .yml file which will contain the actions you want to complete.  Check out the template [here](https://github.com/mirrulations/CIWebTest/blob/main/.github/workflows/github-actions-demo.yml).
    - These commands are run from an ubuntu terminal by a “runner” created by github for this purpose
- Create a github secret to store AWS credentials, this is accomplished in the following steps
    - Click _**Settings**_
    - Under _**Secrets and Variables**_ click _**Actions**_
    - Click _**New repository secret**_ and add the secret name and data
        - Remember to create a secret for both the access key and the secret access key

After all this is done your github actions file is complete, you can test it by pushing some minor change or with this [repo](https://github.com/nektos/act) found by our teammate Owen.