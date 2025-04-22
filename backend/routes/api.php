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
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::controller(CategoryController::class)->group(function () {
    Route::get('categories', 'index');
    Route::get('categories/{id}', 'show');
});

Route::controller(BrandController::class)->group(function () {
    Route::get('brands', 'index');
    Route::get('brands/{id}', 'show');
});

Route::controller(ProductController::class)->group(function () {
    Route::get('products', 'index');
    Route::get('products/{id}', 'show');
    Route::get('products/featured', 'featuredCollections');
    Route::get('products/best', 'bestCollection');
    Route::get('products/limited', 'limitedEdition');
    Route::get('product/banners', 'banners');
});

Route::controller(SlideshowController::class)->group(function () {
    Route::get('slideshows', 'index');
    Route::get('slideshows/{id}', 'show');
});

Route::controller(LogoController::class)->group(function () {
    Route::get('logos', 'index');
    Route::get('logos/{id}', 'show');
});

Route::post('/checkout', [CheckoutController::class, 'checkout']);

Route::post('/verify-payment', [CheckoutController::class, 'verifyPayment']);

/*
|--------------------------------------------------------------------------
| Admin Routes (Protected)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['requireAuth', 'checkRole:admin'])->group(function () {

    // Categories
    Route::controller(CategoryController::class)->group(function () {
        Route::post('categories', 'store');
        Route::put('categories/{id}', 'update');
        Route::delete('categories/{id}', 'destroy');
    });

    // Brands
    Route::controller(BrandController::class)->group(function () {
        Route::post('brands', 'store');
        Route::put('brands/{id}', 'update');
        Route::delete('brands/{id}', 'destroy');
    });

    // Products
    Route::controller(ProductController::class)->group(function () {
        Route::post('products', 'store');
        Route::put('products/{id}', 'update');
        Route::delete('products/{id}', 'destroy');
    });

    // Slideshows
    Route::controller(SlideshowController::class)->group(function () {
        Route::post('slideshows', 'store');
        Route::put('slideshows/{id}', 'update');
        Route::delete('slideshows/{id}', 'destroy');
    });

    // Logos
    Route::controller(LogoController::class)->group(function () {
        Route::post('logos', 'store');
        Route::put('logos/{id}', 'update');
        Route::delete('logos/{id}', 'destroy');
    });
});
