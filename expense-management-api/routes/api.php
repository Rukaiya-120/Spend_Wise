<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Context\ContextController;

/*
|--------------------------------------------------------------------------
| Public Auth Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {

    // Standard auth
    Route::post('/register',       [AuthController::class, 'register']);
    Route::post('/login',          [AuthController::class, 'login']);
    Route::post('/forgot-password',[PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

    // Google OAuth
    Route::get('/google/redirect',  [OAuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback',  [OAuthController::class, 'handleGoogleCallback']);

});

/*
|--------------------------------------------------------------------------
| Protected Routes (JWT required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    // Auth session management
    Route::prefix('auth')->group(function () {
        Route::post('/logout',  [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me',       [AuthController::class, 'me']);
        Route::patch('/profile',[ProfileController::class, 'update']);
    });

    // Day 2+ routes go here...

    // ── Context routes ─────────────────────────────────────────────────────
    Route::prefix('contexts')->group(function () {

        // FR-CT-06: List all user contexts (personal + groups)
        Route::get('/',                                     [ContextController::class, 'index']);

        // FR-CT-02: Create a group
        Route::post('/groups',                              [ContextController::class, 'createGroup']);

        // FR-CT-03: Join a group via invite code
        Route::post('/join',                                [ContextController::class, 'joinGroup']);

        // View a single context
        Route::get('/{context}',                            [ContextController::class, 'show']);

        // FR-CT-05: Member management (admin only)
        Route::post('/{context}/approve/{userId}',          [ContextController::class, 'approveMember']);
        Route::delete('/{context}/members/{userId}',        [ContextController::class, 'removeMember']);
        Route::post('/{context}/transfer-admin',            [ContextController::class, 'transferAdmin']);
        Route::post('/{context}/revoke-invite',             [ContextController::class, 'revokeInviteCode']);
    });


});
