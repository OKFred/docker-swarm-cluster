# case

## Stack
- Nodejs (ESM)
  - axios
- Docker

## Description
- Read env keywords: CASE_NAME, CASE_TOKEN, SERVER_URL
- Call the server and get details of the case; details are as follows:
  - caseName: the name of the case
  - caseToken: the token of the case
  - caseTimeout: it determines that if the caseTimeout is greater than the returnTime, when the caseTimeout is reached, the case will be sucessful, otherwise it will be failed
  - returnTime: determines when to init the callback
  - callbackURL: the URL to call back to
  - return schema: {
    "data": { caseName; caseToken; caseSucceed: boolean },
    "ok": boolean,
    "message": string
    }
- Handle case deletion:
  - Call the server to delete the case using the id
  - return schema: { "ok": boolean }