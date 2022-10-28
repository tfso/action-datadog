# tfso/action-datadog
A action for [datadog service definition v2](https://github.com/DataDog/schema/blob/main/service-catalog/v2/schema.json). It will read the datadog service file, and retrieve `dd-service`, `team` and tag named `module` and map them to outputs `service`, `team` and `module`.

In addition to outputs, it will also set the following environment variables `DD_SERVICE`, `TFSO_DD_SERVICE`, `DD_TAGS`, `TFSO_DD_TAGS`. Team will be added to the `DD_TAGS` and `TFSO_DD_TAGS` environment variables as well.

Example of usage:

```yaml
- uses: tfso/action-datadog@v1
  id: datadog

- uses: tfso/action-deployment@v1
  with:
    team: ${{ steps.datadog.outputs.team }}
    module: ${{ steps.datadog.outputs.module }}
    dd-service: ${{ steps.datadog.outputs.service }}
    ...
```

## Multipart yaml
If the service definition is a multipart yaml separated with three dashes you may have to use a service match to pick the correct service definition. If service match is is left out it will return the first document in the yaml.

If the multipart yaml is like this; 

```yaml
schema-version: v2
dd-service: translation.api.24sevenoffice.com
team: ops
tags:
  - module:administration
---
schema-version: v2
dd-service: translation.worker.24sevenoffice.com
team: ops
tags:
  - module:administration
```

and you want to pick the service definition for the worker you could use the input `service` with `tfso/action-datadog@v1` using a string match or regex: 

```yaml
- uses: tfso/action-datadog@v1
  with:
    service: /worker/i
```
