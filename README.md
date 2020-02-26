# apollo-server-upload

`BadRequestError: Missing multipart field ‘operations’` is not expected:

```
yarn install
./node_modules/.bin/ts-node upload.ts
```

and try

```
curl -X POST \
  http://localhost:8080/foo/graphql \
  -H 'Cache-Control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'operations={"query":"mutation ($file: Upload!) {upload(file: $file) }","variables":{}}' \
  -F 'map={"0":["variables.file"]}' \
  -F '"0"=@dummy.pdf'
```

it outputs:

```
./node_modules/.bin/ts-node upload.ts
App listening on port 8080
🚀 Server ready at http://localhost:8080/foo/graphql
BadRequestError: Missing multipart field ‘operations’ (https://github.com/jaydenseric/graphql-multipart-request-spec).
```

using netcat, operations is there:

```
netcat -vlp 8080
Connection from 127.0.0.1:61048
POST /foo/graphql HTTP/1.1
Host: localhost:8080
User-Agent: curl/7.64.1
Accept: */*
Cache-Control: no-cache
Content-Length: 13753
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW; boundary=------------------------c4abde94d4e0d8b7
Expect: 100-continue

--------------------------c4abde94d4e0d8b7
Content-Disposition: attachment; name="operations"

{"query":"mutation ($file: Upload!) {upload(file: $file) }","variables":{}}
--------------------------c4abde94d4e0d8b7
Content-Disposition: attachment; name="map"

{"0":["variables.files.0"]}
--------------------------c4abde94d4e0d8b7
Content-Disposition: attachment; name="\"0\""; filename="dummy.pdf"
Content-Type: application/pdf

%PDF-1.4
```
