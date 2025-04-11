<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!$user || $user->role !== $role) {
            return response()->json(['error' => 'Forbidden: Insufficient role'], 403);
        }

        return $next($request);
    }
}
