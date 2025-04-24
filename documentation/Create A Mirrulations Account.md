**Create A Mirrulations Account Through The AWS Console**

1. Log on to the AWS Console: [AWS Console](https://us-east-1.console.aws.amazon.com/console/home?region=us-east-1#)  
   1. In the search bar, type: **Cognito** and select it.  
2. Go to the user pool: ***mirrulations\_user\_pool*** and select it.  
3. In the user pool, select **Users**, under **User Management** on the side bar.  
4. Select **Create User**  
   1. Under **Invitation Message** select ***Send an email invitation***   
   2. Enter the username for the account  
   3. Enter the email address of the account. This is where the invite email will be sent. Also select the *check box* next to **Mark email address as verified**  
   4. Under **Temporary password** select **Generate a password**. The user will have to change this anyway.  
5. Hit **Create User**  
6. An email will be sent to the email address provided. It will contain the username and temporary password for the account.  
7. When the user logs into Mirrulations with their username and temporary password, they will be prompted to create their own password adhering to the requirements.  
8. After doing so, the user will be brought back to the login screen where they may now log in with their username and new password.