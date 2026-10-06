const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_0kvIvU5Dz',
      userPoolClientId: '6tsdq0s8ijim7cq3erp2plp3v2',
      identityPoolId: '',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    }
  },
  Storage: {
    S3: {
      bucket: 'job-ninjas-resumes',
      region: 'us-east-1'
    }
  }
};

export default awsconfig;
