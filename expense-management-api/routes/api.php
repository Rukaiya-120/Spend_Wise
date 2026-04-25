<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\OAuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Balance\BalanceController;
use App\Http\Controllers\Budget\BudgetController;
use App\Http\Controllers\Context\ContextController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Expense\CategoryController;
use App\Http\Controllers\Expense\ExpenseController;
use Illuminate\Support\Facades\Route;

// ── Public Auth ───────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register',        [AuthController::class, 'register']);
    Route::post('/login',           [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password',  [PasswordResetController::class, 'resetPassword']);
    Route::get('/google/redirect',  [OAuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback',  [OAuthController::class, 'handleGoogleCallback']);
});

// ── Protected ─────────────────────────────────────────────────────────────
Route::middleware('auth:api')->group(function () {

    // Auth session
    Route::prefix('auth')->group(function () {
        Route::post('/logout',   [AuthController::class, 'logout']);
        Route::post('/refresh',  [AuthController::class, 'refresh']);
        Route::get('/me',        [AuthController::class, 'me']);
        Route::patch('/profile', [ProfileController::class, 'update']);
    });

    // Contexts
    Route::prefix('contexts')->group(function () {
        Route::get('/',                                  [ContextController::class, 'index']);
        Route::post('/groups',                           [ContextController::class, 'createGroup']);
        Route::post('/join',                             [ContextController::class, 'joinGroup']);
        Route::get('/{context}',                         [ContextController::class, 'show']);
        Route::post('/{context}/approve/{userId}',       [ContextController::class, 'approveMember']);
        Route::delete('/{context}/members/{userId}',     [ContextController::class, 'removeMember']);
        Route::post('/{context}/transfer-admin',         [ContextController::class, 'transferAdmin']);
        Route::post('/{context}/revoke-invite',          [ContextController::class, 'revokeInviteCode']);
    });

    // Categories
    Route::prefix('categories')->group(function () {
        Route::get('/',               [CategoryController::class, 'index']);
        Route::post('/',              [CategoryController::class, 'store']);
        Route::delete('/{category}',  [CategoryController::class, 'destroy']);
    });

    // Expenses
    Route::prefix('expenses')->group(function () {
        Route::get('/',                   [ExpenseController::class, 'index']);
        Route::post('/',                  [ExpenseController::class, 'store']);
        Route::get('/{expense}',          [ExpenseController::class, 'show']);
        Route::put('/{expense}',          [ExpenseController::class, 'update']);
        Route::delete('/{expense}',       [ExpenseController::class, 'destroy']);
        Route::patch('/{expense}/settle', [ExpenseController::class, 'settle']);
    });

    // Balances & Settlements
    Route::prefix('balances')->group(function () {
        Route::get('/summary',       [BalanceController::class, 'summary']);
        Route::post('/settlements',  [BalanceController::class, 'recordSettlement']);
        Route::get('/settlements',   [BalanceController::class, 'settlementHistory']);
    });

    // Budgets
    Route::prefix('budgets')->group(function () {
        Route::get('/',            [BudgetController::class, 'index']);
        Route::post('/',           [BudgetController::class, 'store']);
        Route::put('/{budget}',    [BudgetController::class, 'update']);
        Route::delete('/{budget}', [BudgetController::class, 'destroy']);
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/',         [DashboardController::class, 'index']);
        Route::get('/chart',    [DashboardController::class, 'chart']);
        Route::get('/activity', [DashboardController::class, 'activity']);
    });

});