### <ins>How To Create a Github Actions Workflow:</ins>
- It is important to note now and for the future that when making changes to github actions you must **push directly to upstream**.  This is typically bad practice but is required for github actions to work.  Need more information? Check out the  [Discord](https://discord.com/channels/1332506599020822620/1333536321515290646/1336078961943380030).
1. Create a directory ./github/workflows in the main repository. 
2. Create a .yml file which will contain the actions you want to complete.  Check out the template [here](https://github.com/mirrulations/CIWebTest/blob/main/.github/workflows/github-actions-demo.yml).
    - These commands are run from an ubuntu terminal by a “runner” created by github for this purpose
3. Create a github secret to store AWS credentials, this is accomplished in the following steps
    - Click _**Settings**_
    - Under _**Secrets and Variables**_ click _**Actions**_
    - Click _**New repository secret**_ and add the secret name and data
        - Remember to create a secret for both the access key and the secret access key

After all this is done your github actions file is complete, you can test it by pushing some minor change or with this [repo](https://github.com/nektos/act) found by our teammate Owen.