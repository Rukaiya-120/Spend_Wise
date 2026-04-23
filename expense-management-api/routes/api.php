<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Context\ContextController;
use App\Http\Controllers\Expense\CategoryController;
use App\Http\Controllers\Expense\ExpenseController;
use App\Http\Controllers\Balance\BalanceController;
use App\Http\Controllers\Budget\BudgetController;
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
     
    // ── Categories ────────────────────────────────────────────────────────
    Route::prefix('categories')->group(function () {
        Route::get('/',          [CategoryController::class, 'index']);   // list system + custom
        Route::post('/',         [CategoryController::class, 'store']);   // Pro: create custom
        Route::delete('/{category}', [CategoryController::class, 'destroy']); // delete custom
    });

    // ── Expenses ──────────────────────────────────────────────────────────
    Route::prefix('expenses')->group(function () {
        Route::get('/',                    [ExpenseController::class, 'index']);   // FR-EX-08
        Route::post('/',                   [ExpenseController::class, 'store']);   // FR-EX-01
        Route::get('/{expense}',           [ExpenseController::class, 'show']);
        Route::put('/{expense}',           [ExpenseController::class, 'update']); // FR-EX-05
        Route::delete('/{expense}',        [ExpenseController::class, 'destroy']); // FR-EX-06
        Route::patch('/{expense}/settle',  [ExpenseController::class, 'settle']); // FR-EX-09
    });

    // ── Balance & Settlement ──────────────────────────────────────────────
    Route::prefix('balances')->group(function () {

        // FR-BA-02: Balance summary (who owes whom)
        Route::get('/summary', [BalanceController::class, 'summary']);

        // FR-BA-03 / FR-BA-04: Record settlement + update balance atomically
        Route::post('/settlements', [BalanceController::class, 'recordSettlement']);

        // FR-BA-05: Settlement history
        Route::get('/settlements', [BalanceController::class, 'settlementHistory']);
    });

    // ── Budget ────────────────────────────────────────────────────────────
    Route::prefix('budgets')->group(function () {

        // FR-BU-03: List budgets with progress for a month
        Route::get('/',              [BudgetController::class, 'index']);

        // FR-BU-01 / FR-BU-02: Set overall or category budget
        Route::post('/',             [BudgetController::class, 'store']);

        // Update budget amount
        Route::put('/{budget}',      [BudgetController::class, 'update']);

        // Delete budget entry
        Route::delete('/{budget}',   [BudgetController::class, 'destroy']);
    });

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

    Route::middleware('auth:api')->group(function () {

    // ── (existing auth + context routes) ─────────────────────────────────


});


});

