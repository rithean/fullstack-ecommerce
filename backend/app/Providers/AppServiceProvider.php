<?php

namespace App\Providers;

use App\Http\Middleware\CheckRole;
use App\Http\Middleware\RequireAuth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Route::aliasMiddleware('requireAuth', RequireAuth::class);
        Route::aliasMiddleware('checkRole', CheckRole::class);

        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));
    }
}
