/*
 * Impact
 * Here you can find documentation and examples for Greenspark Impact API
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

package io.swagger.client.api;

import io.swagger.client.model.ImpactDto;
import org.junit.Test;
import org.junit.Ignore;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * API tests for ImpactsApi
 */
@Ignore
public class ImpactsApiTest {

    private final ImpactsApi api = new ImpactsApi();

    /**
     * Create Impact
     *
     * Creates an impact associated with a source and a trigger.
     *
     * @throws Exception
     *          if the Api call fails
     */
    @Test
    public void impactsControllerCreateImpactTest() throws Exception {
        ImpactDto body = null;
        String sourceId = null;
        String triggerId = null;
        api.impactsControllerCreateImpact(body, sourceId, triggerId);

        // TODO: test validations
    }
    /**
     * Create Tailored Impact
     *
     * Creates an impact associated wit a user id.
     *
     * @throws Exception
     *          if the Api call fails
     */
    @Test
    public void impactsControllerCreateTailoredImpactTest() throws Exception {
        ImpactDto body = null;
        api.impactsControllerCreateTailoredImpact(body);

        // TODO: test validations
    }
}
