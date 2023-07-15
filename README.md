# Neutralize Mock Server

Alternative to mock REST API's using Node JS with Express and static json file. It's possible using that for:

- Mock for, in development, API to simulate external HTTP call.
- Mock for API, in test environment, to run integration tests over container or ci pipelines.

The future versions will release with:

- [ ] Different data source to allow the Mock API consume your mock from database or any other data source.
- [ ] Interface to managing local data and make easy change mock API's.
- [ ] On demand customizations.

## How to use

Steps.

### Create your API

Take a lock on the `src/mock.json` to see how create your own Mock API. The structure is like the:

```json
[
  {
    "name": "Get user by id",
    "method": "get",
    "path": "/v1/users/:id",
    "pathMatch": "^/v1/users/\\d$",
    "matchs": [
      {
        "key": "id",
        "value": "1",
        "statusCode": 200,
        "defaultMatch": false,
        "response": {
          "id": "1",
          "name": "Lorem Ipsun"
        }
      }
    ]
  }
]
```

#### Where

- `name`: is the name of the API, just for display.
- `method`: is the HTTP Verb of the API.
- `path`: is the API path where your will consume as a mock. Take a look in the [express doc](https://expressjs.com/en/guide/routing.html).
- `pathMatch` is the dynamic regex where using to determine if the route is match by the patch.
- `matchs` is the possibilities matches for this path of the API. the match value is determined by the key and value, where:
  - `key`: can be a value from body, route or query from the request.
  - `value`: is the value to compare and verify if the request is match.
  - `statusCode`: is the status code to respond when match.
  - `defaultMatch`: if any params, (key, value), is match and the default value is true then request is reponse this mock.
  - `response`: is the value to respond when the api is match, if null the request will have no response.


### Create a `Dockerfile`

```Dockerfile
FROM neutralize/mock-server
COPY mock.json src/mock.json
ENTRYPOINT npm run start
```

#### Build the mock API

```shell
docker build . --file Dockerfile --tag mock:api
```

#### Run the mock API

```bash
docker run -p 3000:3000 -it mock:api
```

```bash
> neutralize-mock-server@1.0.0 start
> node ./src/server.js

Mock API listening on port 3000
```

#### In the example if the you make the request the api will respond that:

```bash
GET http://localhost:3000/v1/users/1 HTTP/1.1
```

```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 31
ETag: W/"1f-Cy8cQ6tyjuBzJnhcNfAWR5NcXZk"
Date: Sun, 28 May 2023 14:11:42 GMT
Connection: close

{
  "id": "1",
  "name": "Lorem Ipsun"
}
```

## To contribute

1. Clone the repo
2. Make a pull request

#### Run containers

> Build local image

```bash
docker build . --file Dockerfile --tag neutralize-mock-server:latest
```

> Tests

```bash
docker run -it neutralize-mock-server:latest npm run test
```

```bash
> neutralize-mock-server@1.0.0 test
> npx jest

 PASS  test/app.controller.test.js
  app.controller
    (GET /v1/users) when get all users
      ✓ should response status 200 (1 ms)
      ✓ should response all users (1 ms)
    (GET /v1/users) when get all users filtred by name
      ✓ should response status 200
      ✓ should response all users
    (GET /v1/users/:id) when get users by id
      ✓ should response status 200 (1 ms)
      ✓ should response all users
    (POST /v1/users) when create a user
      ✓ should response status 201
    (PUT /v1/users/:id) when update a user
      ✓ should response status 204
    (DELETE /v1/users/:id) when delete a user
      ✓ should response status 204

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        0.341 s
Ran all test suites.
```
