<?php

namespace App\Swagger;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="SpendWise Expense API",
 *     version="1.0.0",
 *     description="API documentation for Expense Management System"
 * )
 *
 * @OA\Server(
 *     url="http://expense-management-api.test",
 *     description="Local Server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
class ApiDocumentation
{
    // Intentionally empty
}