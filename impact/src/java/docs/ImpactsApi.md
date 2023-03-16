# ImpactsApi

All URIs are relative to *https://sandbox.getgreenspark.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**impactsControllerCreateImpact**](ImpactsApi.md#impactsControllerCreateImpact) | **POST** /v1/impacts/sources/{sourceId}/triggers/{triggerId} | Create Impact
[**impactsControllerCreateTailoredImpact**](ImpactsApi.md#impactsControllerCreateTailoredImpact) | **POST** /v1/impacts | Create Tailored Impact

<a name="impactsControllerCreateImpact"></a>
# **impactsControllerCreateImpact**
> impactsControllerCreateImpact(body, sourceId, triggerId)

Create Impact

Creates an impact associated with a source and a trigger.

### Example
```java
// Import classes:
//import io.swagger.client.ApiClient;
//import io.swagger.client.ApiException;
//import io.swagger.client.Configuration;
//import io.swagger.client.auth.*;
//import io.swagger.client.api.ImpactsApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: access-key
ApiKeyAuth access-key = (ApiKeyAuth) defaultClient.getAuthentication("access-key");
access-key.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access-key.setApiKeyPrefix("Token");

ImpactsApi apiInstance = new ImpactsApi();
ImpactDto body = new ImpactDto(); // ImpactDto | 
String sourceId = "sourceId_example"; // String | The id of the source associated with the impact.
String triggerId = "triggerId_example"; // String | The id of the trigger associated with the impact.
try {
    apiInstance.impactsControllerCreateImpact(body, sourceId, triggerId);
} catch (ApiException e) {
    System.err.println("Exception when calling ImpactsApi#impactsControllerCreateImpact");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ImpactDto**](ImpactDto.md)|  |
 **sourceId** | **String**| The id of the source associated with the impact. |
 **triggerId** | **String**| The id of the trigger associated with the impact. |

### Return type

null (empty response body)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="impactsControllerCreateTailoredImpact"></a>
# **impactsControllerCreateTailoredImpact**
> impactsControllerCreateTailoredImpact(body)

Create Tailored Impact

Creates an impact associated wit a user id.

### Example
```java
// Import classes:
//import io.swagger.client.ApiClient;
//import io.swagger.client.ApiException;
//import io.swagger.client.Configuration;
//import io.swagger.client.auth.*;
//import io.swagger.client.api.ImpactsApi;

ApiClient defaultClient = Configuration.getDefaultApiClient();

// Configure API key authorization: access-key
ApiKeyAuth access-key = (ApiKeyAuth) defaultClient.getAuthentication("access-key");
access-key.setApiKey("YOUR API KEY");
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//access-key.setApiKeyPrefix("Token");

ImpactsApi apiInstance = new ImpactsApi();
ImpactDto body = new ImpactDto(); // ImpactDto | 
try {
    apiInstance.impactsControllerCreateTailoredImpact(body);
} catch (ApiException e) {
    System.err.println("Exception when calling ImpactsApi#impactsControllerCreateTailoredImpact");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**ImpactDto**](ImpactDto.md)|  |

### Return type

null (empty response body)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

