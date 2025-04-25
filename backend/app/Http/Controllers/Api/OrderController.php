<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    // Create order
    public function saveOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'shipping' => 'required|numeric',
            'payment_status' => 'nullable|string',
            'status' => 'nullable|string',
            'cart' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Create order
        $order = Order::create([
            'name' => $request->name,
            'email' => $request->email,
            'address' => $request->address,
            'subtotal' => $request->subtotal,
            'discount' => $request->discount ?? 0,
            'shipping' => $request->shipping,
            'payment_status' => $request->payment_status ?? 'not paid',
            'status' => $request->status ?? 'pending',
            'user_id' => $request->user()->id,
        ]);

        // Create order items
        foreach ($request->cart as $item) {
            OrderItem::create([
                'product_id' => $item['product_id'],
                'order_id' => $order->id,
                'name' => $item['name'],
                'price' => $item['qty'] * $item['price'],
                'qty' => $item['qty'],
            ]);
        }

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => $order->load('items'),
        ], 201);
    }


    // Authenticated user: my orders
    public function myOrders(Request $request)
    {
        $orders = Order::with('items')->where('user_id', $request->user()->id)->latest()->get();
        return response()->json($orders);
    }

    // View one order
    public function show(Request $request, $id)
    {
        $order = Order::with('items')->findOrFail($id);

        if ($request->user()->id !== $order->user_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    // Admin: all orders
    public function index()
    {
        $orders = Order::with(['user', 'items'])->latest()->get();
        return response()->json($orders);
    }

    // Admin: update order
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->only(['status', 'payment_status']));

        return response()->json([
            'message' => 'Order updated successfully.',
            'order' => $order
        ]);
    }

    // Admin: delete order
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully.'
        ]);
    }
}
