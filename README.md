# tfso/action-datadog
A action for [datadog service definition v2](https://github.com/DataDog/schema/blob/main/service-catalog/v2/schema.json). It will read the datadog service file, and retrieve `dd-service`, `team` and tag named `module` and map them to outputs `service`, `team` and `module`.

In addition to outputs, it will also set the following environment variables `DD_SERVICE`, `TFSO_DD_SERVICE`, `DD_TAGS`, `TFSO_DD_TAGS`.

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