<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\{
    BrandController,
    CategoryController,
    CollectionController,
    FooterController,
    LogoController,
    ProductController,
    SlideshowController,
    OrderController,
    UserController,
    AboutController
};

/*
|----------------------------------------------------------------------
| Auth Routes
|----------------------------------------------------------------------
*/

Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('forgot-password', 'forgotPassword');
    Route::post('verify-otp', 'verifyOTP');
    Route::post('reset-password', 'resetPassword');

    Route::middleware('requireAuth')->group(function () {
        Route::get('me', 'me');
        Route::delete('logout', 'logout');
    });
});

/*
|----------------------------------------------------------------------
| Public Routes
|----------------------------------------------------------------------
*/

Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{id}', [CategoryController::class, 'show']);

Route::get('brands', [BrandController::class, 'index']);
Route::get('brands/{id}', [BrandController::class, 'show']);

Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);
Route::get('trending', [ProductController::class, 'trendingProduct']);
Route::get('limited', [ProductController::class, 'limitedEdition']);

Route::get('collections', [CollectionController::class, 'index']);
Route::get('collections/{id}', [CollectionController::class, 'show']);
Route::get('featured', [CollectionController::class, 'featuredCollections']);
Route::get('best', [CollectionController::class, 'bestCollections']);
Route::get('discount', [CollectionController::class, 'discountCollections']);

Route::get('slideshows', [SlideshowController::class, 'index']);
Route::get('slideshows/{id}', [SlideshowController::class, 'show']);

Route::get('logos', [LogoController::class, 'index']);
Route::get('logos/{id}', [LogoController::class, 'show']);

Route::get('footers', [FooterController::class, 'index']);
Route::get('footers/{id}', [FooterController::class, 'show']);

Route::get('abouts', [AboutController::class, 'index']);

Route::middleware('requireAuth')->group(function () {
    Route::post('orders', [OrderController::class, 'saveOrder']);
    Route::get('orders', [OrderController::class, 'myOrders']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
});

/*
|----------------------------------------------------------------------
| Admin Routes (Protected)
|----------------------------------------------------------------------
*/

Route::prefix('admin')->middleware(['requireAuth', 'checkRole:admin'])->group(function () {

    // Categories
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{id}', [CategoryController::class, 'update']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

    // Brands
    Route::post('brands', [BrandController::class, 'store']);
    Route::put('brands/{id}', [BrandController::class, 'update']);
    Route::delete('brands/{id}', [BrandController::class, 'destroy']);

    // Products
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);

    // Slideshows
    Route::post('slideshows', [SlideshowController::class, 'store']);
    Route::put('slideshows/{id}', [SlideshowController::class, 'update']);
    Route::delete('slideshows/{id}', [SlideshowController::class, 'destroy']);

    // Logos
    Route::post('logos', [LogoController::class, 'store']);
    Route::put('logos/{id}', [LogoController::class, 'update']);
    Route::delete('logos/{id}', [LogoController::class, 'destroy']);

    // Slideshows
    Route::post('collections', [CollectionController::class, 'store']);
    Route::put('collections/{id}', [CollectionController::class, 'update']);
    Route::delete('collections/{id}', [CollectionController::class, 'destroy']);

    // Order
    Route::get('orders', [OrderController::class, 'index']);
    Route::put('orders/{id}', [OrderController::class, 'update']);
    Route::delete('orders/{id}', [OrderController::class, 'destroy']);

    // User
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    Route::post('footers', [FooterController::class, 'store']);
    Route::put('footers/{id}', [FooterController::class, 'update']);
    Route::delete('footers/{id}', [FooterController::class, 'destroy']);
});
