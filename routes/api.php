<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\LogoController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SlideshowController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Models\Slideshow;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOTP']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware(['requireAuth'])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::delete('/logout', [AuthController::class, 'logout']);
    });
});

Route::prefix('admin')->group(function () {
    Route::middleware(['requireAuth', 'checkRole:admin'])->group(function () {
        // Route::resource('categories', CategoryController::class);
        // Categories Route 
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/categories/{id}', [CategoryController::class, 'show']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Brand Routes
        Route::get('/brands', [BrandController::class, 'index']);
        Route::post('/brands', [BrandController::class, 'store']);
        Route::get('/brands/{id}', [BrandController::class, 'show']);
        Route::put('/brands/{id}', [BrandController::class, 'update']);
        Route::delete('/brands/{id}', [BrandController::class, 'destroy']);

        // Product routes
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Slideshow roues
        Route::get('/slideshows', [SlideshowController::class, 'index']);
        Route::post('/slideshows', [SlideshowController::class, 'store']);
        Route::get('/slideshows/{id}', [SlideshowController::class, 'show']);
        Route::put('/slideshows/{id}', [SlideshowController::class, 'update']);
        Route::delete('/slideshows/{id}', [SlideshowController::class, 'destroy']);

        // Logo roues
        Route::get('/logos', [LogoController::class, 'index']);
        Route::post('/logos', [LogoController::class, 'store']);
        Route::get('/logos/{id}', [LogoController::class, 'show']);
        Route::put('/logos/{id}', [LogoController::class, 'update']);
        Route::delete('/logos/{id}', [LogoController::class, 'destroy']);

    });
});
