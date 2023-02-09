# {{classname}}

All URIs are relative to *https://sandbox.getgreenspark.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**EmailControllerAddDomain**](EmailApi.md#EmailControllerAddDomain) | **Post** /v1/email/domains | Add Domain
[**EmailControllerAddTemplate**](EmailApi.md#EmailControllerAddTemplate) | **Post** /v1/email/templates | Add Template
[**EmailControllerDeleteDomain**](EmailApi.md#EmailControllerDeleteDomain) | **Delete** /v1/email/domains/{domainId} | Delete Domain
[**EmailControllerDeleteTemplate**](EmailApi.md#EmailControllerDeleteTemplate) | **Delete** /v1/email/templates/{templateId} | Delete Template
[**EmailControllerFetchDomains**](EmailApi.md#EmailControllerFetchDomains) | **Get** /v1/email/domains | Fetch Domains
[**EmailControllerFetchTemplates**](EmailApi.md#EmailControllerFetchTemplates) | **Get** /v1/email/templates | Fetch Templates
[**EmailControllerFetchTemplatesDefaults**](EmailApi.md#EmailControllerFetchTemplatesDefaults) | **Get** /v1/email/templates-defaults | Fetch Templates Defaults
[**EmailControllerTestTemplate**](EmailApi.md#EmailControllerTestTemplate) | **Post** /v1/email/templates/test | Test Template
[**EmailControllerUpdateTemplate**](EmailApi.md#EmailControllerUpdateTemplate) | **Put** /v1/email/templates/{templateId} | Update Template
[**EmailControllerVerifyDomain**](EmailApi.md#EmailControllerVerifyDomain) | **Post** /v1/email/domains/{domainId}/verify | Verify Domain

# **EmailControllerAddDomain**
> CustomDomainDto EmailControllerAddDomain(ctx, body)
Add Domain

Add your domain and receive the DNS records that must be added to your domain.

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
  **body** | [**CustomDomainRequestBody**](CustomDomainRequestBody.md)|  | 

### Return type

[**CustomDomainDto**](CustomDomainDto.md)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerAddTemplate**
> NotificationTemplateResponseDto EmailControllerAddTemplate(ctx, body)
Add Template

Add your notification template for email sending.

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
  **body** | [**NotificationTemplateRequestDto**](NotificationTemplateRequestDto.md)|  | 

### Return type

[**NotificationTemplateResponseDto**](NotificationTemplateResponseDto.md)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerDeleteDomain**
> CustomDomainDto EmailControllerDeleteDomain(ctx, domainId)
Delete Domain

Delete your domain.

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
  **domainId** | **string**| The id of the custom domain object. | 

### Return type

[**CustomDomainDto**](CustomDomainDto.md)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerDeleteTemplate**
> NotificationTemplateResponseDto EmailControllerDeleteTemplate(ctx, templateId)
Delete Template

Delete your template.

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
  **templateId** | **string**| The id of the notification template. | 

### Return type

[**NotificationTemplateResponseDto**](NotificationTemplateResponseDto.md)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerFetchDomains**
> []CustomDomainDto EmailControllerFetchDomains(ctx, )
Fetch Domains

Fetch your previously added domains.

### Required Parameters
This endpoint does not need any parameter.

### Return type

[**[]CustomDomainDto**](CustomDomainDto.md)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerFetchTemplates**
> []NotificationTemplateResponseDto EmailControllerFetchTemplates(ctx, )
Fetch Templates

Fetch templates for email sending.

### Required Parameters
This endpoint does not need any parameter.

### Return type

[**[]NotificationTemplateResponseDto**](NotificationTemplateResponseDto.md)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerFetchTemplatesDefaults**
> Object EmailControllerFetchTemplatesDefaults(ctx, )
Fetch Templates Defaults

Fetch templates defaults for email sending.

### Required Parameters
This endpoint does not need any parameter.

### Return type

**Object**

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerTestTemplate**
> EmailControllerTestTemplate(ctx, body)
Test Template

Add your notification template for email sending.

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
  **body** | [**TestNotificationTemplateRequestDto**](TestNotificationTemplateRequestDto.md)|  | 

### Return type

 (empty response body)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerUpdateTemplate**
> NotificationTemplateResponseDto EmailControllerUpdateTemplate(ctx, body, templateId)
Update Template

Update your notification template for email sending.

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
  **body** | [**NotificationTemplateRequestDto**](NotificationTemplateRequestDto.md)|  | 
  **templateId** | **string**| The id of the notification template. | 

### Return type

[**NotificationTemplateResponseDto**](NotificationTemplateResponseDto.md)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **EmailControllerVerifyDomain**
> CustomDomainDto EmailControllerVerifyDomain(ctx, domainId)
Verify Domain

Verify your domain based on the provided DNS records.

### Required Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
  **domainId** | **string**| The id of the custom domain object. | 

### Return type

[**CustomDomainDto**](CustomDomainDto.md)

### Authorization

[access-key](../README.md#access-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

