<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // The table associated with the model.
    protected $table = 'orders';

    // The attributes that are mass assignable.
    protected $fillable = [
        'user_id',
        'subtotal',
        'shipping',
        'discount',
        'payment_status',
        'status',
        'name',
        'email',
        'address',
        'order_number',
    ];

    // The attributes that should be cast to native types.
    protected $casts = [
        'subtotal' => 'double',
        'shipping' => 'double',
        'discount' => 'double',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Set default values for attributes
    protected $attributes = [
        'payment_status' => 'not paid',
        'status' => 'pending',
    ];

    // Generate order number automatically
    public static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            // Auto-generate order number if not provided
            if (!$order->order_number) {
                $order->order_number = 'ORD-' . date('Ymd') . '-' . str_pad(Order::count() + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relationship with the User model (assuming you have a User model)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with the OrderItem model
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
