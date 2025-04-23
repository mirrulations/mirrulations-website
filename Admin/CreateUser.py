import boto3

# Initialize the Cognito client
client_cognito = boto3.client('cognito-idp')

# Create the user
response = client_cognito.admin_create_user(
    UserPoolId='<YOUR_USER_POOL_ID>',
    Username='<USERNAME>',
    UserAttributes=[
        {
            'Name': 'email',
            'Value': '<USER_EMAIL>'
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
# Note: Replace <YOUR_USER_POOL_ID>, <USERNAME>, and <USER_EMAIL> with actual values.
# This script creates a new user in the specified Cognito User Pool and sends an invitation email.



