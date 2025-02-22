# server

## Stack
- Nodejs (ESM)
  - Hono (web server)
  - axios (http client)
  - sqlite3 (database)
    - including following tables:
      - my_case
        - id
        - caseName
        - caseToken
        - caseTimeout
        - returnTime
        - callbackURL
        - caseSucceed
        - caseFinished
- Docker
  - Docker swarm
    - role: manager

## Description
- Provide the following apis:
  - /api/case/add
    - req param schema: { caseName, caseToken, caseTimeout, returnTime, callbackURL }
    Save it to the DB.
    return with { "data": int(id); "ok": boolean }
  - /api/case/list
    - req param schema: { orderBy: string, asc: boolean, pageNo: int, pageSize: int }
    - return with { "data": [ { id; caseName; caseToken; caseTimeout; returnTime; callbackURL; caseSucceed; caseFinished } ]; "ok": boolean }
  - /api/case/get/{id}
    Use docker swarm to run the case with the following environment variables:
    - CASE_NAME
    - CASE_TOKEN
    - SERVER_URL
  - /api/case/update/{id}
    - req param schema: { caseName; caseToken; caseSucceed }
    - No matter the case is successful or not, mark the case as finished in the DB
    - Update DB
  - /api/case/delete/{id}
    - Delete the case from the DB
    - return with { "ok": boolean }
