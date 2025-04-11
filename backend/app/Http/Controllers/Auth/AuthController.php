<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendResetOTP;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'error' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role
            ]);

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'status' => true,
                'message' => 'Registered successfully',
                'token' => $token,
                'user' => $user
            ], 201);
        } catch (JWTException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            return response()->json([
                'status' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => JWTAuth::user()
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Could not create token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function me()
    {
        try {
            $user = JWTAuth::user();

            return response()->json([
                'status' => true,
                'user' => $user
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Could not get user information',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        $otp = rand(100000, 999999);

        $user->reset_otp = $otp;
        $user->otp_expires_at = now()->addMinutes(15);
        $user->save();

        Mail::to($user->email)->send(new SendResetOTP($otp));

        return response()->json([
            'status' => true,
            'message' => 'OTP sent to your email address'
        ]);
    }

    public function verifyOTP(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric|digits:6', 
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->reset_otp !== $request->otp) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid OTP.'
            ], 400);
        }

        if (now()->greaterThan($user->otp_expires_at)) {
            return response()->json([
                'status' => false,
                'message' => 'OTP has expired.'
            ], 400);
        }

        return response()->json([
            'status' => true,
            'message' => 'OTP verified successfully.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6|confirmed', 
            'otp' => 'required|numeric|digits:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->reset_otp !== $request->otp) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid OTP.'
            ], 400);
        }

        if (now()->greaterThan($user->otp_expires_at)) {
            return response()->json([
                'status' => false,
                'message' => 'OTP has expired.'
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->reset_otp = null;
        $user->otp_expires_at = null; 
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Password reset successfully.'
        ]);
    }


    public function logout()
    {
        try {
            $token = JWTAuth::getToken();

            if (!$token) {
                return response()->json([
                    'status' => false,
                    'message' => 'No token provided'
                ], 400);
            }

            JWTAuth::invalidate($token);

            return response()->json([
                'status' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ]);
        }
    }
}
