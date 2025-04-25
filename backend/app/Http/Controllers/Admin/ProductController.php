<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($brandId = $request->input('brand_id')) {
            $query->where('brand_id', $brandId);
        }

        $sortBy = $request->input('sort_by', 'id');
        $sortDir = $request->input('sort_dir', 'asc');
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->input('per_page', 6);
        $products = $query->paginate($perPage);

        return response()->json([
            'status' => true,
            'data' => $products
        ], 200);
    }

    public function trendingProduct()
    {
        $products = Product::orderBy('created_at', 'DESC')
            ->where('is_trending', 1)
            ->limit(4)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $products
        ], 200);
    }

    public function limitedEdition()
    {
        $products = Product::orderBy('id', 'ASC')
            ->where('is_limited', 1)
            ->limit(12)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $products
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'price'        => 'required|numeric|min:0',
            'qty'          => 'required|numeric|min:0',
            'description'  => 'required|string',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'status'       => 'nullable|in:0,1',
            'category_id'  => 'required|exists:categories,id',
            'brand_id'     => 'required|exists:brands,id',
            'is_trending'   => 'nullable|in:0,1',
            'is_limited'   => 'nullable|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'name',
            'price',
            'qty',
            'description',
            'status',
            'category_id',
            'brand_id',
            'is_trending',
            'is_limited',
        ]);

        if ($request->hasFile('image')) {
            $filename = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('uploads/products', $filename, 'public');
            $data['image'] = '/storage/' . $path;
        }

        Product::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully.'
        ], 201);
    }

    public function show(string $id)
    {
        $product = Product::with(['category', 'brand'])->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $product
        ], 200);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|required|string|max:255',
            'price'       => 'sometimes|required|numeric|min:0',
            'qty'         => 'sometimes|required|numeric|min:0',
            'description' => 'sometimes|required|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'status'      => 'nullable|in:0,1',
            'category_id' => 'sometimes|required|exists:categories,id',
            'brand_id'    => 'sometimes|required|exists:brands,id',
            'is_trending'  => 'nullable|in:0,1',
            'is_limited'  => 'nullable|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'name',
            'price',
            'qty',
            'description',
            'status',
            'category_id',
            'brand_id',
            'is_trending',
            'is_limited',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
            }

            $filename = time() . '_' . $request->file('image')->getClientOriginalName();
            $path = $request->file('image')->storeAs('uploads/products', $filename, 'public');
            $data['image'] = '/storage/' . $path;
        }

        $product->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully.'
        ], 200);
    }

    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found'
            ], 404);
        }

        if ($product->image) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
        }

        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully.'
        ], 200);
    }
}
