<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Http;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        try {
            // 1. Validate request
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:255',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'paypal_payment_id' => 'required|string', // Added PayPal payment ID for confirmation
                'paypal_payment_status' => 'required|string', // PayPal payment status
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'error' => $validator->errors(),
                ], 422);
            }

            // 2. Calculate total and prepare order items
            $totalPrice = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                $subtotal = $product->price * $item['quantity'];
                $totalPrice += $subtotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];
            }

            // 3. Create Order
            $order = Order::create([
                'user_id' => $request->user_id,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'total_price' => $totalPrice,
                'payment_status' => $request->paypal_payment_status, // Storing PayPal payment status
                'paypal_payment_id' => $request->paypal_payment_id, // Storing PayPal payment ID
            ]);

            // 4. Attach order items
            foreach ($orderItems as $item) {
                $item['order_id'] = $order->id;
                OrderItem::create($item);
            }

            // 5. Optional: Update inventory based on order (deduct stock)
            foreach ($orderItems as $item) {
                $product = Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);
            }

            // 6. Return success response
            return response()->json([
                'status' => true,
                'message' => 'Checkout successful!',
                'order_id' => $order->id,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Checkout failed!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        // 1. Validate PayPal payment status and payment ID
        $validator = Validator::make($request->all(), [
            'paypal_payment_id' => 'required|string',
            'paypal_payment_status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'error' => $validator->errors(),
            ], 422);
        }

        // 2. Verify payment with PayPal API (sandbox)
        $paypalClientId = 'AfoGBDV7ALjR749En8LgdzKhSBJ9zuBChk6Rat_WFVL1VU9i4-xJtHO-YxiJ_ESCHrxf3wvGsgCOAIOu';
        $paypalSecret = 'EOzklwiN7syGL6494hrncltePQQ1d0C4BVfCwrYoQqwbCxQi5AP1dlkun3yzlc7smq8PBF8GjvGb3RB8';
        $paypalApiUrl = 'https://api.sandbox.paypal.com/v1/payments/payment/' . $request->paypal_payment_id;

        $response = Http::withBasicAuth($paypalClientId, $paypalSecret)->get($paypalApiUrl);

        // 3. Check the response from PayPal and update the order status
        if ($response->successful()) {
            $paymentDetails = $response->json();

            // Check if the payment was successful
            if ($paymentDetails['state'] === 'approved') {
                // Update the order payment status to 'completed'
                $order = Order::where('paypal_payment_id', $request->paypal_payment_id)->first();
                if ($order) {
                    $order->payment_status = 'completed';
                    $order->save();
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Payment verified successfully!',
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Payment verification failed.',
                ], 400);
            }
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Error verifying PayPal payment.',
                'error' => $response->body(),
            ], 500);
        }
    }
}
