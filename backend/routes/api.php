<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\{
    BrandController,
    CategoryController,
    LogoController,
    ProductController,
    SlideshowController
};
use App\Http\Controllers\CheckoutController;

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
Route::get('products/featured', [ProductController::class, 'featuredCollections']);
Route::get('products/best', [ProductController::class, 'bestCollection']);
Route::get('products/limited', [ProductController::class, 'limitedEdition']);
Route::get('product/banners', [ProductController::class, 'banners']);

Route::get('slideshows', [SlideshowController::class, 'index']);
Route::get('slideshows/{id}', [SlideshowController::class, 'show']);

Route::get('logos', [LogoController::class, 'index']);
Route::get('logos/{id}', [LogoController::class, 'show']);

Route::post('/checkout', [CheckoutController::class, 'checkout']);
Route::post('/verify-payment', [CheckoutController::class, 'verifyPayment']);

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
});
