import boto3

# Initialize the Cognito client
client_cognito = boto3.client('cognito-idp')

# Create the user
response = client_cognito.admin_create_user(
    UserPoolId='us-east-1_RzH8CctP2',
    Username='davin1234',
    UserAttributes=[
        {
            'Name': 'email',
            'Value': 'glynnd@moravian.edu'
        },
        {
            'Name': 'email_verified',
            'Value': 'true'  # Mark email as verified
        }
    ],
    DesiredDeliveryMediums=['EMAIL']  # Send invitation by email
)

# Output result
print(f"User created: {response['User']['Username']}")



